import { Video } from './Step';

export interface StepJSON {
    _id : String;
    step: number;
    type: string;
    title: string;
    url: string;
    choices: string[];
    isVideo:boolean;
    content:string;
    description:string;
    section:string;
    steps:[StepJSON];
    medias:[Video];
    borneHaute:string;
    borneBasse:string;
  }

export interface Form {
    questions: [StepJSON],
    title: String,
    _id : String
}


export interface FormServer{
    form:Form
}