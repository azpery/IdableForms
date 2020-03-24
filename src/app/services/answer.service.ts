import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Answer } from '../models/Answer';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})

export class AnswerService extends GenericService {

    constructor(httpClient:HttpClient){
        super(httpClient);
    }
    sendAnswers(answers:Answer[]): Promise<any> {
        let papa = this;
        return this.http.post<any>(this.url + '/api/answers/create',{answers: answers}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

}