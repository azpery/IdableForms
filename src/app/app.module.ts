import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClientModule } from '@angular/common/http'; 
import {SafePipe} from './safePipe'



@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent, CarouselFormsComponent]
})
export class AppModule { }
