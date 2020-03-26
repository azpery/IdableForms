import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselFormsComponent } from './carousel-forms/carousel-forms.component';
import { AppComponent } from './app.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormAdminComponent } from './components/form-admin/form-admin.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'form/:id', component: CarouselFormsComponent },
  { path: '', component: HomeComponent },
  { path: 'createNewForm', component: FormBuilderComponent },
  { path: 'form/edit/:id', component: FormBuilderComponent },
  { path: 'admin/forms', component: FormAdminComponent },
  { path: 'csv/:id', component: FormAdminComponent },
  { path: 'thankyou', component: ThankYouComponent },
  { path: '**',   redirectTo: '', pathMatch: 'full' },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
