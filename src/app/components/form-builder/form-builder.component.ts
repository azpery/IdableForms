import { Component, OnInit, Input } from '@angular/core';
import { Form } from 'src/app/models/Form';
import { Step } from 'src/app/models/Step';
import { FormGroup } from '@angular/forms';
import { StepService } from 'src/app/services/step.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  
  form: Form = {
    _id: "",
    title:"Nouveau formulaire",
    steps:new Array<Step>()
  } as Form

  FormIdable:FormGroup = new FormGroup({});

  constructor(private route:ActivatedRoute, private stepService:StepService) { }

  ngOnInit(): void {
    if(this.route.snapshot.params.id != undefined)
      this.stepService.getForm(this.route.snapshot.params.id).then(form => {
        this.form = form
      })
  }

}
