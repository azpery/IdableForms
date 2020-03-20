import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { Form } from 'src/app/models/Form';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.scss']
})
export class FormAdminComponent implements OnInit {
  forms:[Form]

  constructor(private formService:FormService) { }

  ngOnInit(): void {
    this.formService.getForms().then(forms=>{
      this.forms = forms.forms
      console.log(forms.forms)
    })
  }

}
