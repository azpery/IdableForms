import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Answer } from '../models/Answer';
import { Form } from '../models/Form';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})

export class FormService extends GenericService {

    constructor(httpClient:HttpClient){
        super(httpClient);
    }

    sendForm(form:Form): Promise<any> {
        return this.http.post<any>(this.url+'/api/form/create',{form: form}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

    updateForm(form:Form): Promise<any> {
        return this.http.put<any>(this.url+'/api/form/update/'+form._id,{form: form}).toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

    getForms(): Promise<any> {
        return this.http.get<any>(this.url+'/api/form/get').toPromise().then(function(data) {
            console.log(data)
            return data;
        }.bind(this));
    }

    getCsv(id:string ): void{
         this.http.get(this.url+'/api/csv/get/s'+id)
         .subscribe((res:Response)=>{
           var a = document.createElement("a");
           a.href = URL.createObjectURL(res.blob());
           a.download = "test.csv";
           // start download
           a.click();
         })
    }

}