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
  /** Choix unique ou multiples : propose aussi « Autre » avec une réponse libre. */
  allowOther?: boolean;
  steps?: Step[];
}

export interface Step {
  _id?: string;
  step: number;
  content: StepContent;
}

export interface FormOwner {
  _id: string;
  name: string;
  email: string;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  imgUrl: string;
  /** Affiché sur la page d'accueil (modifiable par un administrateur). */
  featured?: boolean;
  /** Renseigné dans la liste « Mes formulaires ». */
  owner?: FormOwner | null;
  steps: Step[];
}

/** Choix multiples : cases cochées et, si « Autre » est coché, son texte (undefined : non coché). */
export interface MultipleValue {
  checked: boolean[];
  other?: string;
}

/** Choix unique : « Autre » choisi, avec son texte. */
export interface OtherValue {
  other: string;
}

/** Valeur d'une réponse : texte (oui/non, choix, réponse libre), nombre (jauge, -1 = « je le fais déjà »),
 *  choix multiples ou « Autre » d'un choix unique. */
export type AnswerValue = string | number | MultipleValue | OtherValue;

export function isMultipleValue(value: AnswerValue | undefined): value is MultipleValue {
  return typeof value === 'object' && 'checked' in value;
}

export function isOtherValue(value: AnswerValue | undefined): value is OtherValue {
  return typeof value === 'object' && !('checked' in value);
}

export interface Answer {
  form: string;
  formInstance: string;
  question: string;
  answer: string | number | boolean[];
  /** Texte de « Autre » d'un choix multiple. */
  other?: string;
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
