import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiState } from './core/ui-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly ui = inject(UiState);
}
