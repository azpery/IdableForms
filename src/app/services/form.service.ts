import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Answer } from '../models/Answer';
import { Form } from '../models/Form';

@Injectable({
  providedIn: 'root',
})

export class FormService {

    constructor(
        private http: HttpClient
        ) { }

    sendForm(form:Form): Promise<any> {
        return this.http.post<any>('http://localhost/api/form/create',{form: form}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

    updateForm(form:Form): Promise<any> {
        return this.http.put<any>('http://localhost/api/form/update/'+form._id,{form: form}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

    getForms(): Promise<any> {
        return this.http.get<any>('http://localhost/api/form/get').toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

}