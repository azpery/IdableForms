import { Component, OnInit, Input } from '@angular/core';
import { Form } from 'src/app/models/Form';
import { Step, Section, Radio } from 'src/app/models/Step';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
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

  constructor(private route:ActivatedRoute, private stepService:StepService, private formBuilder:FormBuilder) {
    this.FormIdable = this.formBuilder.group(
      {
        title:[],
        steps:this.formBuilder.array([])
      }
    )
  }

  ngOnInit(): void {
    if(this.route.snapshot.params.id != undefined)
      this.stepService.getForm(this.route.snapshot.params.id).then(form => {
        // console.log(form)
        this.form = form
        
        let steps = this.form.steps.map(this.createStepsControls, this)

        console.log(steps)
        let stepsArray = this.formBuilder.array(steps)
        this.FormIdable.setControl('steps', stepsArray)
      })
  }

  get steps(): FormArray {
    let steps = this.FormIdable.get('steps') as FormArray;
    // console.log(steps.value)
    return steps;
  };

  subSteps(no): FormArray{
    let steps = this.FormIdable.get('steps') as FormArray;
    console.log(no)
    return steps.at(no).get('content').get('steps') as FormArray;
  }

  submit(){
    console.log(this.FormIdable.value)
  }

  private createStepsControls(step) {


    var section:Section = step.content as Section
    // console.log("section is " + section)
    if(section.steps != undefined){
      
      var stepsGroup = section.steps.map(this.createStepsControls, this);

      return this.formBuilder.group({
        content:this.formBuilder.group({
          title:step.content.title,
          type:step.content.type,
          steps:this.formBuilder.array(stepsGroup)
        })
      })

    }else{
      console.log(step.content)
      let radio = step.content as Radio
      if(radio.choices != undefined)
        step.content.choices = [radio.choices]
      return this.formBuilder.group({
        content:this.formBuilder.group(step.content)
      })

    }
    
  }

}
