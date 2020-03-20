import { Component, OnInit, Input } from '@angular/core';
import { Form } from 'src/app/models/Form';
import { Step, Section, Radio, Content, ContentType } from 'src/app/models/Step';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
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

        this.form = form
        
        //Data binds to form
        let steps = this.form.steps.map(this.createStepsControls, this)

        console.log(steps)

        let stepsArray = this.formBuilder.array(steps)
        this.FormIdable.setControl('steps', stepsArray)
      })
  }

  get steps(): FormArray {
    let steps = this.FormIdable.get('steps') as FormArray;
    return steps;
  };

  subSteps(no): FormArray{
    let steps = this.FormIdable.get('steps') as FormArray;
    console.log(steps.at(no).get('content').get('steps'))
    return steps.at(no).get('content').get('steps') as FormArray;
  }

  submit(){
    console.log(this.FormIdable.value)
  }

  addStepAfter(index){
    let steps = this.steps
    this.insertNewStep(steps, index);
  }

  removeStepAt(index){
    this.steps.removeAt(index)
  }

  addSubStepAfter(stepno,index){
    let steps = this.subSteps(stepno)
    this.insertNewStep(steps, index);
  }

  removeSubStepAt(stepno,index){
    this.subSteps(stepno).removeAt(index)
  }

  private insertNewStep(steps: FormArray, index: any) {
    steps.insert(index + 1, this.formBuilder.group({
      step: index + 1,
      content: this.formBuilder.group({ title: "", type: ContentType.yesno } as Content)
    }));
  }

  private createStepsControls(step) {

    var section:Section = step.content as Section
    // console.log("section is " + section)
    if(step.content.type == "section"){
      
      var stepsGroup = section.steps.map(this.createStepsControls, this);

      return this.formBuilder.group({
        content:this.formBuilder.group({
          title:step.content.title,
          type:step.content.type,
          steps:this.formBuilder.array(stepsGroup)
        })
      })

    }else{
      let radio = step.content as Radio
      if(radio.choices != undefined)
        step.content.choices = this.formBuilder.array(radio.choices)
      return this.formBuilder.group({
        content:this.formBuilder.group(step.content)
      })

    }
    
  }

}
