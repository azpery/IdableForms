import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 


@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent, CarouselFormsComponent]
})
export class AppModule { }
