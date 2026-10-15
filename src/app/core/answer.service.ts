import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Answer } from './models';

@Injectable({ providedIn: 'root' })
export class AnswerService {
  private readonly http = inject(HttpClient);

  async send(answers: Answer[]): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiUrl}/api/answers/create`, { answers }));
  }
}
