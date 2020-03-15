import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClientModule } from '@angular/common/http'; 
import {SafePipe} from './safePipe'
import { QuestionComponent } from './components/question.component';
import { YesNoDirective } from './directives/yesno.directive';



@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent,
    QuestionComponent,
    SafePipe,
    YesNoDirective
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent, CarouselFormsComponent,QuestionComponent]
})
export class AppModule { }
