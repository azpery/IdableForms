import { Step } from './Step';

export interface Form{
    _id:String,
    title:String,
    description:String,
    imgUrl:String,
    steps:Step[]
}