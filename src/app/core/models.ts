export type StepType = 'media' | 'section' | 'yesno' | 'radio' | 'multiple' | 'jauge' | 'text' | 'open';

export interface MediaItem {
  _id?: string;
  name: string;
  url: string;
  isVideo: boolean;
}

export interface StepContent {
  type: StepType;
  title: string;
  description?: string;
  body?: string;
  choices?: string[];
  medias?: MediaItem[];
  borneBasse?: string;
  borneHaute?: string;
  disablable?: boolean;
  /** Le participant peut passer la question sans répondre. */
  optional?: boolean;
  steps?: Step[];
}

export interface Step {
  _id?: string;
  step: number;
  content: StepContent;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  imgUrl: string;
  steps: Step[];
}

/** Valeur d'une réponse : texte (oui/non, choix, réponse libre), nombre (jauge, -1 = « je le fais déjà ») ou cases cochées. */
export type AnswerValue = string | number | boolean[];

export interface Answer {
  form: string;
  formInstance: string;
  question: string;
  answer: AnswerValue;
}

export const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: 'yesno', label: 'Oui / Non' },
  { value: 'radio', label: 'Choix unique' },
  { value: 'multiple', label: 'Choix multiples' },
  { value: 'jauge', label: 'Échelle de 1 à 5' },
  { value: 'open', label: 'Réponse libre' },
  { value: 'text', label: 'Texte informatif' },
  { value: 'media', label: 'Image ou vidéo' },
  { value: 'section', label: 'Partie (groupe de questions)' },
];

const QUESTION_TYPES: StepType[] = ['yesno', 'radio', 'multiple', 'jauge', 'open'];

export function isQuestion(step: Step): boolean {
  return QUESTION_TYPES.includes(step.content.type);
}

export function countQuestions(steps: Step[]): number {
  return steps.reduce((n, s) => n + (isQuestion(s) ? 1 : 0) + countQuestions(s.content.steps ?? []), 0);
}
