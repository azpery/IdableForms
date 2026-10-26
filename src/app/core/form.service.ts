import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { plainToHtml } from '../shared/rich-text';
import { Form, FormOwner, MediaItem, OpenFormat, Step, StepType } from './models';

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
  allowOther?: boolean;
  format?: OpenFormat;
  steps?: (QuestionJson | string)[];
}

interface FormJson {
  _id: string;
  title: string;
  description?: string;
  imgUrl?: string;
  featured?: boolean;
  owner?: FormOwner | null;
  questions: QuestionJson[];
}

@Injectable({ providedIn: 'root' })
export class FormService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api`;

  /** Formulaires de l'utilisateur connecté (tous pour un administrateur). */
  async list(): Promise<Form[]> {
    const { forms } = await firstValueFrom(this.http.get<{ forms: FormJson[] }>(`${this.url}/form/get`));
    return forms.map(decodeForm);
  }

  /** Formulaires mis en avant sur la page d'accueil. */
  async listPublic(): Promise<Form[]> {
    const { forms } = await firstValueFrom(this.http.get<{ forms: FormJson[] }>(`${this.url}/form/public`));
    return forms.map(decodeForm);
  }

  async get(id: string): Promise<Form> {
    const { form } = await firstValueFrom(this.http.get<{ form: FormJson }>(`${this.url}/form/get/${id}`));
    return decodeForm(form);
  }

  async save(form: Form): Promise<Form> {
    const { owner, ...fields } = form;
    const body = { form: { ...fields, steps: encodeSteps(form.steps) } };
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
    featured: !!json.featured,
    owner: json.owner,
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
      // Description de partie : saisie dans un éditeur riche (les anciennes sont du texte simple)
      description: json.type === 'section' ? plainToHtml(json.description ?? '') : (json.description ?? ''),
      body: json.content ?? '',
      choices: json.choices ?? [],
      medias: (json.medias ?? []).map(({ _id, name, url, isVideo }) => ({ _id, name, url, isVideo })),
      borneBasse: json.borneBasse ?? '',
      borneHaute: json.borneHaute ?? '',
      disablable: !!json.disablable,
      optional: !!json.optional,
      allowOther: !!json.allowOther,
      format: json.format ?? 'long',
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
