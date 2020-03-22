import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Answer } from '../models/Answer';

@Injectable({
  providedIn: 'root',
})

export class AnswerService {

    constructor(
        private http: HttpClient
        ) { }

    sendAnswers(answers:Answer[]): Promise<any> {
        let papa = this;
        return this.http.post<any>('https://idableformserver.robin-delaporte.fr/api/answers/create',{answers: answers}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

}