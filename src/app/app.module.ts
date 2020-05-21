import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import {SafePipe} from './safePipe'
import { QuestionComponent } from './components/question/question.component';
import { Ng5SliderModule } from 'ng5-slider';
import { BackgroundComponent } from './components/background/background.component';
import { RandomcolorModule } from 'angular-randomcolor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormBuilderItemComponent } from './components/form-builder-item/form-builder-item.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormAdminComponent } from './components/form-admin/form-admin.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ErrorDialogService } from './services/errorDialog.service';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ControlComponent } from './components/control/control.component';


 
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};


@NgModule({
  declarations: [
    AppComponent,
    CarouselFormsComponent,
    QuestionComponent,
    SafePipe,
    BackgroundComponent,
    FormBuilderComponent,
    FormBuilderItemComponent,
    FormAdminComponent,
    ThankYouComponent,
    ErrorDialogComponent,
    HomeComponent,
    ControlComponent
  ],
  entryComponents: [ErrorDialogComponent],
  exports: [
    ErrorDialogComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    Ng5SliderModule,
    RandomcolorModule,
    ReactiveFormsModule,
    FormsModule,
    CKEditorModule,
    NgHttpLoaderModule.forRoot(),
    SwiperModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule
    
  ],
  providers: [{
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  },
  ErrorDialogService,
  { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }],
  bootstrap: [AppComponent, CarouselFormsComponent]
})
export class AppModule { }
