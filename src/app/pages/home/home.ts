import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormService } from '../../core/form.service';
import { countQuestions } from '../../core/models';
import { SiteHeader } from '../../shared/site-header';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteHeader],
  templateUrl: './home.html',
})
export class Home {
  private readonly formService = inject(FormService);

  protected readonly forms = resource({ loader: () => this.formService.list() });
  protected readonly countQuestions = countQuestions;

  protected scrollToForms() {
    document.getElementById('questionnaires')?.scrollIntoView({ behavior: 'smooth' });
  }
}
