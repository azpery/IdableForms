import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Form, Step } from './models';

interface RawAnswer {
  question: string;
  formInstance: string;
  answer?: string;
  answers?: string[];
}

export interface Bar {
  label: string;
  count: number;
  /** Part en % des répondants à la question. */
  share: number;
  leader: boolean;
}

export interface DayCount {
  date: Date;
  count: number;
}

export interface QuestionResult {
  step: Step;
  respondents: number;
  /** Choix unique, oui/non, choix multiples, variantes de média. */
  bars?: Bar[];
  /** Échelle 1 à 5. */
  scale?: { bars: Bar[]; average: number | null; alreadyDoing: number };
  /** Réponses libres (ou textes « Autre » d'un choix multiple), les plus récentes d'abord. */
  texts?: { text: string; date: Date }[];
}

export interface ResultSection {
  title: string | null;
  questions: QuestionResult[];
}

export interface FormResults {
  participations: number;
  first: Date | null;
  last: Date | null;
  perDay: DayCount[];
  sections: ResultSection[];
}

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private readonly http = inject(HttpClient);

  async load(form: Form): Promise<FormResults> {
    const { answers } = await firstValueFrom(
      this.http.get<{ answers: RawAnswer[] }>(`${environment.apiUrl}/api/answer/byform/${form._id}`),
    );
    return computeResults(form, answers);
  }
}

export function computeResults(form: Form, answers: RawAnswer[]): FormResults {
  const byQuestion = new Map<string, RawAnswer[]>();
  for (const answer of answers) {
    byQuestion.set(answer.question, [...(byQuestion.get(answer.question) ?? []), answer]);
  }

  // formInstance est l'horodatage (ms) de l'envoi du formulaire.
  const instances = [...new Set(answers.map((a) => a.formInstance))].map(Number).sort((a, b) => a - b);

  const sections: ResultSection[] = [];
  let loose: ResultSection | null = null;
  for (const step of form.steps) {
    if (step.content.type === 'section') {
      loose = null;
      const questions = (step.content.steps ?? []).map((s) => questionResult(s, byQuestion.get(s._id!) ?? []));
      sections.push({ title: step.content.title, questions: questions.filter(isUseful) });
    } else {
      const result = questionResult(step, byQuestion.get(step._id!) ?? []);
      if (!isUseful(result)) continue;
      if (!loose) sections.push((loose = { title: null, questions: [] }));
      loose.questions.push(result);
    }
  }

  return {
    participations: instances.length,
    first: instances.length ? new Date(instances[0]) : null,
    last: instances.length ? new Date(instances.at(-1)!) : null,
    perDay: perDay(instances),
    sections: sections.filter((s) => s.questions.length),
  };
}

/** Les textes informatifs et les médias à variante unique n'apportent rien aux résultats. */
function isUseful(result: QuestionResult): boolean {
  const { type } = result.step.content;
  if (type === 'text' || type === 'section') return false;
  if (type === 'media') return (result.step.content.medias?.length ?? 0) > 1;
  return true;
}

function questionResult(step: Step, answers: RawAnswer[]): QuestionResult {
  const { content } = step;
  const respondents = answers.length;

  switch (content.type) {
    case 'yesno':
      return { step, respondents, bars: countChoices(['Oui', 'Non'], answers.map((a) => a.answer)) };
    case 'radio': {
      const choices = content.choices ?? [];
      const bars = countChoices(choices, answers.map((a) => a.answer));
      if (!content.allowOther) return { step, respondents, bars };
      // Réponses hors des choix proposés : textes saisis dans « Autre » (ou choix renommés depuis).
      const known = new Set(choices);
      return { step, respondents, bars, texts: toTexts(answers.filter((a) => a.answer && !known.has(a.answer))) };
    }
    case 'media':
      return { step, respondents, bars: countChoices((content.medias ?? []).map((m) => m.name), answers.map((a) => a.answer)) };
    case 'multiple': {
      const labels = [...(content.choices ?? [])];
      const counts = labels.map((_, i) => answers.filter((a) => a.answers?.[i] === 'true').length);
      if (!content.allowOther) return { step, respondents, bars: toBars(labels, counts, respondents) };
      const texts = toTexts(answers);
      return { step, respondents, bars: toBars([...labels, 'Autre'], [...counts, texts.length], respondents), texts };
    }
    case 'jauge': {
      const values = answers.map((a) => Number(a.answer));
      const rated = values.filter((v) => v >= 1 && v <= 5);
      const counts = [1, 2, 3, 4, 5].map((n) => rated.filter((v) => v === n).length);
      return {
        step,
        respondents,
        scale: {
          bars: toBars(['1', '2', '3', '4', '5'], counts, rated.length),
          average: rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null,
          alreadyDoing: values.filter((v) => v === -1).length,
        },
      };
    }
    case 'open': {
      const texts = toTexts(answers);
      return { step, respondents: texts.length, texts };
    }
    default:
      return { step, respondents };
  }
}

function toTexts(answers: RawAnswer[]): { text: string; date: Date }[] {
  return answers
    .filter((a) => a.answer?.trim())
    .map((a) => ({ text: a.answer!.trim(), date: new Date(Number(a.formInstance)) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function countChoices(choices: string[], values: (string | undefined)[]): Bar[] {
  const known = new Set(choices);
  const labels = [...choices];
  // Réponses à des choix renommés ou supprimés depuis : regroupées dans « Autre ».
  const others = values.filter((v) => v !== undefined && !known.has(v)).length;
  if (others) labels.push('Autre');
  const counts = labels.map((label, i) =>
    i < choices.length ? values.filter((v) => v === label).length : others,
  );
  return toBars(labels, counts, values.length);
}

function toBars(labels: string[], counts: number[], total: number): Bar[] {
  const max = Math.max(0, ...counts);
  return labels.map((label, i) => ({
    label,
    count: counts[i],
    share: total ? (counts[i] / total) * 100 : 0,
    leader: max > 0 && counts[i] === max,
  }));
}

/** Participations par jour, du premier jour (30 jours max) à aujourd'hui, jours vides compris. */
function perDay(instances: number[]): DayCount[] {
  if (!instances.length) return [];
  const dayStart = (t: number) => new Date(new Date(t).setHours(0, 0, 0, 0));
  const today = dayStart(Date.now());
  const first = dayStart(instances[0]);
  const start = new Date(Math.max(first.getTime(), today.getTime() - 29 * 86_400_000));

  const days: DayCount[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), count: 0 });
  }
  for (const t of instances) {
    const index = Math.round((dayStart(t).getTime() - start.getTime()) / 86_400_000);
    if (days[index]) days[index].count++;
  }
  return days;
}
