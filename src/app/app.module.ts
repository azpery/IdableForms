import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClientModule } from '@angular/common/http'; 
import {SafePipe} from './safePipe'
import { QuestionComponent } from './components/question/question.component';
import { Ng5SliderModule } from 'ng5-slider';
import { BackgroundComponent } from './components/background/background.component';
import { RandomcolorModule } from 'angular-randomcolor';




@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent,
    QuestionComponent,
    SafePipe,
    BackgroundComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    Ng5SliderModule,
    RandomcolorModule
  ],
  providers: [],
  bootstrap: [AppComponent, CarouselFormsComponent,QuestionComponent]
})
export class AppModule { }
