import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import { AppComponent } from './app.component';


const routes: Routes = [{ path: 'form', component: CarouselFormsComponent },{ path: '', component: AppComponent }]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
