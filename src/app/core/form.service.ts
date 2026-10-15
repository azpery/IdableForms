import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Form, MediaItem, Step, StepType } from './models';

/** Question telle que renvoyée par l'API (sous-étapes et médias peuplés). */
interface QuestionJson {
  _id: string;
  step: number;
  type: StepType;
  title: string;
  description?: string;
  content?: string;
  choices?: string[];
  medias?: MediaItem[];
  borneBasse?: string;
  borneHaute?: string;
  disablable?: boolean;
  optional?: boolean;
  steps?: (QuestionJson | string)[];
}

interface FormJson {
  _id: string;
  title: string;
  description?: string;
  imgUrl?: string;
  questions: QuestionJson[];
}

@Injectable({ providedIn: 'root' })
export class FormService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api`;

  async list(): Promise<Form[]> {
    const { forms } = await firstValueFrom(this.http.get<{ forms: FormJson[] }>(`${this.url}/form/get`));
    return forms.map(decodeForm);
  }

  async get(id: string): Promise<Form> {
    const { form } = await firstValueFrom(this.http.get<{ form: FormJson }>(`${this.url}/form/get/${id}`));
    return decodeForm(form);
  }

  async save(form: Form): Promise<Form> {
    const body = { form: { ...form, steps: encodeSteps(form.steps) } };
    const request = form._id
      ? this.http.put<{ form: FormJson }>(`${this.url}/form/update/${form._id}`, body)
      : this.http.post<{ form: FormJson }>(`${this.url}/form/create`, body);
    return decodeForm((await firstValueFrom(request)).form);
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.url}/form/remove/${id}`));
  }

  async downloadCsv(form: Form): Promise<void> {
    const blob = await firstValueFrom(this.http.get(`${this.url}/csv/get/${form._id}`, { responseType: 'blob' }));
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

function decodeForm(json: FormJson): Form {
  return {
    _id: json._id,
    title: json.title,
    description: json.description ?? '',
    imgUrl: json.imgUrl ?? '',
    steps: json.questions.map(decodeStep),
  };
}

function decodeStep(json: QuestionJson): Step {
  return {
    _id: json._id,
    step: json.step,
    content: {
      type: json.type,
      title: json.title,
      description: json.description ?? '',
      body: json.content ?? '',
      choices: json.choices ?? [],
      medias: (json.medias ?? []).map(({ _id, name, url, isVideo }) => ({ _id, name, url, isVideo })),
      borneBasse: json.borneBasse ?? '',
      borneHaute: json.borneHaute ?? '',
      disablable: !!json.disablable,
      optional: !!json.optional,
      steps: (json.steps ?? []).filter((s): s is QuestionJson => typeof s === 'object').map(decodeStep),
    },
  };
}

/** Prépare les étapes pour l'API : numérotation, choix et médias vides retirés. */
function encodeSteps(steps: Step[]): Step[] {
  return steps.map((step, index) => ({
    _id: step._id,
    step: index,
    content: {
      ...step.content,
      choices: step.content.choices?.map((c) => c.trim()).filter(Boolean),
      medias: step.content.medias
        ?.filter((m) => m.url.trim())
        .map((m) => ({ ...m, url: m.url.trim(), name: m.name.trim() || step.content.title })),
      steps: step.content.type === 'section' ? encodeSteps(step.content.steps ?? []) : [],
    },
  }));
}
