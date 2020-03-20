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

export interface Media extends Content{
    url:string,
    isVideo:boolean
}

export interface Text extends Content{
  body:string
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