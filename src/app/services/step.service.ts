import { Injectable } from '@angular/core';
import { Step,StepJSON,Content,Media, MultipleChoice, Radio, TextField,Boolean, ContentType, Section,Text } from '../models/Step';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as steps from '../../bouchon.json';

@Injectable({
  providedIn: 'root',
})

export class StepService {

    constructor(
        private http: HttpClient
        ) { }

    getReelSteps(): Promise<Step[]> {
        return this.http.get<StepJSON[]>('').toPromise().then(data => {
            return data.map(this.decodeStep);
        });
    }

    getSteps(): Step[]{
        
        let s = steps as [StepJSON] 
        console.log(s)
        return s.default.map(this.decodeStep, this);
    }

    decodeStep(json: StepJSON): any {
        var content:Content =  {
            title : json.title,
            type : json.type as unknown as ContentType
        }
        switch (json.type) {
            case "media":
                content  =  {
                    title : json.title,
                    type : json.type as unknown as ContentType,
                    url : json.url,
                    isVideo : json.isVideo
                } as Media
                break;
            case "textField":
                content  =  {
                    title : json.title,
                    type : json.type as unknown as ContentType,
                } as TextField
                break;
            case "multipleChoice":
                content  =  {
                    title : json.title,
                    choices : json.choices as string[],
                    type : json.type as unknown as ContentType,
                } as MultipleChoice
                break;
            case "radio":
                content  =  {
                    title : json.title,
                    choices : json.choices as string[],
                    type : json.type as unknown as ContentType,
                } as Radio
                break;
            case "Boolean":
                content  =  {
                    title : json.title,
                    type : json.type as unknown as ContentType,
                } as Boolean
                break;
            case "section":
                content = {
                    title : json.title,
                    description : json.description,
                    type : json.type as unknown as ContentType,
                    steps : json.steps.map(this.decodeStep, this) as [Step]
                } as Section
                break;
            case "text":
                content = {
                    title : json.title,
                    body : json.body,
                    type : json.type as unknown as ContentType
                } as Text
                break;
            default:
                
                break;
        }
        
        return  {
            step: json.step,
            content : content
        } as Step
    }
}