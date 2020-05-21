import { Component, OnInit, Input } from '@angular/core';
import { Form } from 'src/app/models/Form';
import { Step, Section, Radio, Content, ContentType, Media } from 'src/app/models/Step';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { StepService } from 'src/app/services/step.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  
  form: Form = {
    _id: "",
    title:"Nouveau formulaire",
    description:"",
    imgUrl:"",
    steps:new Array<Step>()
  } as Form

  FormIdable:FormGroup = new FormGroup({});

  constructor(private route:ActivatedRoute, private stepService:StepService, private formBuilder:FormBuilder, private formService:FormService) {
    this.FormIdable = this.formBuilder.group(
      {
        title:[],
        description:"",
        imgUrl:"",
        steps:this.formBuilder.array([])
      }
    )
  }

  ngOnInit(): void {
    if(this.route.snapshot.params.id != undefined){
      this.stepService.getForm(this.route.snapshot.params.id).then(form => {

        this.bindDataToForm(form);
      })
    }else{
      let stepsArray = this.formBuilder.array([])
        this.FormIdable = this.formBuilder.group(
          {
            title:this.form.title,
            description:this.form.description,
            imgUrl:this.form.imgUrl,
            steps:stepsArray
          }
        )
    }
  }

  private bindDataToForm(form: Form) {
    this.form = form;
    //Data binds to form
    let steps = this.form.steps.map(this.createStepsControls, this);
    let stepsArray = this.formBuilder.array(steps);
    this.FormIdable = this.formBuilder.group({
      _id: this.form._id,
      title: this.form.title,
      description:this.form.description,
      imgUrl:this.form.imgUrl,
      steps: stepsArray
    });
  }

  get steps(): FormArray {
    let steps = this.FormIdable.get('steps') as FormArray;
    return steps;
  };

  subSteps(no): FormArray{
    let steps = this.FormIdable.get('steps') as FormArray;
    return steps.at(no).get('content').get('steps') as FormArray;
  }

  saveForm(){

    if(this.form._id != ""){
      this.formService.updateForm(this.FormIdable.value)
    }else{
      this.formService.sendForm(this.FormIdable.value).then(form=>{
        this.bindDataToForm(form)
      })
    }
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
    if(step.content.type == "section"){
      
      var stepsGroup = section.steps.map(this.createStepsControls, this);

      return this.formBuilder.group({
        _id:step._id,
        step:step.step,
        content:this.formBuilder.group({
          title:step.content.title,
          type:step.content.type,
          steps:this.formBuilder.array(stepsGroup)
        })
      })

    }else if(step.content.type == "media"){
      let media = step.content as Media
      let medias = media.medias.map(media =>{
        return this.formBuilder.group(media)
      } ,this)

      step.content.medias = this.formBuilder.array(medias)

      return this.formBuilder.group({
        _id:step._id,
        step:step.step,
        content:this.formBuilder.group(step.content)
      })

    }else{
      let radio = step.content as Radio
      if(radio.choices != undefined)
        step.content.choices = this.formBuilder.array(radio.choices)
      return this.formBuilder.group({
        _id:step._id,
        step:step.step,
        content:this.formBuilder.group(step.content)
      })

    }
    
  }

}
