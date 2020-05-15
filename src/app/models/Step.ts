export interface Step {
    step: number;
    content:Content;
    _id:String;
  }

export interface Content{
  title: string;
  steps:[Step];
  type: ContentType;
}

export interface Video {
    _id:String,
    name:string,
    url:string,
    isVideo:boolean
}

export interface Media extends Content {
  media: Video;
  medias:[Video]
}

export interface Text extends Content{
  body:string
}

export interface Jauge extends Content{
  borneHaute:string,
  borneBasse:string,
  disablable:boolean
}

export interface Section extends Content{
  description: string;
  
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



export enum ContentType{
  text,
  media,
  yesno,
  multiple,
  radio,
  section
}