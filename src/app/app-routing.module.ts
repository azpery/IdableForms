import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import { AppComponent } from './app.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';


const routes: Routes = [
  { path: 'form', component: CarouselFormsComponent },
  { path: '', component: AppComponent },
  { path: 'form/new', component: FormBuilderComponent },
  { path: 'form/edit/:id', component: FormBuilderComponent },
  { path: '**',   redirectTo: '', pathMatch: 'full' },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
