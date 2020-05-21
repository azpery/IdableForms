import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { Form } from 'src/app/models/Form';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.scss']
})
export class FormAdminComponent implements OnInit {
  forms:[Form]

  constructor(private formService:FormService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.params.id != undefined){
      
    }else{
      this.formService.getForms().then(forms=>{
        this.forms = forms.forms
      })
    }
  }

  getCsv(form){
    this.formService.getCsv(form._id, form.title)
  }

}
