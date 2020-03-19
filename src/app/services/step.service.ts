import { Injectable } from '@angular/core';
import { Step,Content,Media, MultipleChoice, Radio, TextField,Boolean, ContentType, Section,Text } from '../models/Step';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as steps from '../../bouchon.json';
import { FormServer, StepJSON } from '../models/Step.md';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root',
})

export class StepService {

    constructor(
        private http: HttpClient
        ) { }

    getSteps(): Promise<Step[]> {
        let papa = this;
        return this.http.get<FormServer>('http://localhost/api/form/get/5e71f38263b2db71a816a5d3').toPromise().then(function(data) {
            console.log(data)
            return data.form.questions.map(papa.decodeStep, this);
        }.bind(this));
    }

    getForm(id:String = "5e71f38263b2db71a816a5d3"): Promise<Form> {
        let papa = this;
        return this.http.get<FormServer>('http://localhost/api/form/get/'+id).toPromise().then(function(data) {
            console.log(data)
            return {
                _id : data.form._id,
                title: data.form.title,
                steps:data.form.questions.map(papa.decodeStep, this) as [Step]
            } as Form
        }.bind(this));
    }

    // getSteps(): Step[]{
        
    //     let s = steps as [StepJSON] 
    //     console.log(s)
    //     return [];
    // }
    

    decodeStep(json: StepJSON): any {
        var content:Content =  {
            title : json.title,
            steps:[] as unknown as [Step],
            type : json.type as unknown as ContentType,
        }
        console.log("coucou")
        switch (json.type) {
            case "media":
                content  =  {
                    title : json.title,
                    type : json.type as unknown as ContentType,
                    url : json.url,
                    steps: [] as unknown as [Step],
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
                    body : json.content,
                    type : json.type as unknown as ContentType
                } as Text
                break;
            default:
                
                break;
        }
        
        return  {
            step: json.step,
            _id: json._id,
            content : content
        } as Step
    }
}