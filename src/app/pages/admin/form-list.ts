import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormService } from '../../core/form.service';
import { Form, countQuestions } from '../../core/models';
import { UiState } from '../../core/ui-state';
import { SiteHeader } from '../../shared/site-header';

@Component({
  selector: 'app-form-list',
  imports: [RouterLink, SiteHeader],
  templateUrl: './form-list.html',
})
export class FormList {
  private readonly formService = inject(FormService);
  private readonly ui = inject(UiState);

  protected readonly forms = resource({ loader: () => this.formService.list() });
  protected readonly countQuestions = countQuestions;

  protected downloadCsv(form: Form) {
    this.formService.downloadCsv(form);
  }

  protected async remove(form: Form) {
    if (!confirm(`Supprimer « ${form.title} » ? Ses questions seront également supprimées.`)) return;
    await this.formService.remove(form._id!);
    this.ui.notify('Formulaire supprimé');
    this.forms.reload();
  }
}
