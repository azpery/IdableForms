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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent,
    QuestionComponent,
    SafePipe,
    BackgroundComponent,
    FormBuilderComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    Ng5SliderModule,
    RandomcolorModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent, CarouselFormsComponent]
})
export class AppModule { }
