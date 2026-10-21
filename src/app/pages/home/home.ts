import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
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
  protected readonly auth = inject(AuthService);

  protected readonly forms = resource({ loader: () => this.formService.listPublic() });
  protected readonly countQuestions = countQuestions;

  protected readonly features = [
    { title: '8 types d\'étapes', text: 'Oui / non, choix, échelles, réponses libres, textes, images et vidéos.', color: 'bg-coral' },
    { title: 'Résultats en direct', text: 'Graphiques par question, évolution des participations, export CSV.', color: 'bg-orchid' },
    { title: 'Vos données à vous', text: 'Chaque compte ne voit que ses propres questionnaires et réponses.', color: 'bg-lagoon' },
  ];

  /** Fonds des vignettes sans image : un dégradé différent par carte. */
  protected readonly covers = [
    'bg-gradient-to-br from-coral to-saffron',
    'bg-gradient-to-br from-orchid to-coral',
    'bg-gradient-to-br from-lagoon to-orchid',
    'bg-gradient-to-br from-saffron to-lagoon',
  ];
}
