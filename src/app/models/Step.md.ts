export interface StepJSON {
    step: number;
    type: string;
    title: string;
    url: string;
    choices: string[];
    isVideo:boolean;
    content:string;
    description:string;
    section:string;
    steps:[StepJSON]
  }

export interface Form {
    questions: [StepJSON],
    title: String,
    _id : String
}

export interface FormServer{
    form:Form
}