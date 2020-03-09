export interface Step {
    step: number;
    content:Content;
  }

export interface Content{
  title: string;
  type: ContentType;
}

export interface Media extends Content{
    url:string,
    isVideo:boolean
}

export interface TextField extends Content{
  
}

export interface MultipleChoice extends Content{
    choices:string[]
}

export interface Boolean extends Content{

}

export interface Radio extends MultipleChoice{

}


export interface StepJSON {
  step: number;
  type: string;
  title: string;
  url: string;
  choices: string[];
  isVideo:boolean;
}

export enum ContentType{
  TextField,
  Media,
  Boolean,
  MultipleChoice,
  Radio
}