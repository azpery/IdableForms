import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class GenericService {
    public url;

    constructor(protected http: HttpClient) { 
        this.url = environment.apiUrl;
    }
}