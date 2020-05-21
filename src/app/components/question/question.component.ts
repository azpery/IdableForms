import { Component, ContentChild, Input, TemplateRef, OnInit, Output, EventEmitter } from '@angular/core';

import { Options, LabelType } from 'ng5-slider';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Step, Media, Jauge, MultipleChoice } from 'src/app/models/Step';
import { Subject } from 'rxjs';
import { tap, switchMap, startWith, filter, take } from 'rxjs/operators';

@Component({
  selector: 'question-view',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() step: Step;
  @Input() type: 'radio' | 'yesno' | 'text' | 'else' | 'jauge' | 'section' | 'media' | 'multiple' | 'open' = 'else';
  @Input() DataForm: FormGroup;
  @Input() lastSection = false;
  @Input() showControls = false;
  @Input() isSection = false;
  @Output() next = new EventEmitter<void>();
  subForm = new FormGroup({});
  formControl:FormControl;
  controlClass='bottom-center';

  value: number = 0;
  options: Options;
  formSubmitSubject$: Subject<unknown>;
  valid = false;
  showErrorMessage = false;
  class= "hide-pointer"
  disabled=false;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {


    if (this.type == 'radio' || this.type == 'yesno' || this.type == 'open') {
      let inputName = this.step._id
      this.formControl = new FormControl('', Validators.required)
      this.DataForm.addControl(inputName.toString(), this.formControl)
    }
    if (this.type == 'section') {
      this.subForm = new FormGroup({})
      this.DataForm.addControl(this.step._id.toString(), this.subForm)
    }
    if (this.type == 'jauge') {
      let inputName = this.step._id
      this.formControl = new FormControl(null, Validators.required)
      this.DataForm.addControl(inputName.toString(), this.formControl)
    }
    if (this.type == 'multiple') {
      let inputName = this.step._id
      this.DataForm.addControl(inputName.toString(), this.formBuilder.array((this.step.content as MultipleChoice).choices.map(V => { return false })))
    }
    if (this.type == 'media') {
      let mediaInputName = this.step._id
      let media = this.step.content as Media
      this.DataForm.addControl(mediaInputName.toString(), new FormControl(media.media.name))
      this.controlClass = 'right_sided'
      this.isSection = false
    }
    if (this.type == 'jauge') {
      this.options = {
        animate: true,
        enforceStep: false,
        showTicks: true,
        showTicksValues: true,
        disabled: this.disabled,
        keyboardSupport: false,
        stepsArray: [
          { value: 1, legend: (this.step.content as Jauge).borneBasse },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5, legend: (this.step.content as Jauge).borneHaute }
        ]
      }
    }
  }


  public validate() {
    Object.keys(this.subForm.controls).forEach(field => { // {1}
      const control = this.subForm.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        //this.validateAllFormFields(control);            //{6}
      }     // {3}
    });
  }

  notConcerned($event){
    if($event.checked){
      
      this.formControl.setValue(0)
      this.class = "disabled"
      this.disabled = this.options.disabled = true
      
    }else{
      
      this.formControl.setValue(null)
      this.class = "hide-pointer"
      this.disabled = this.options.disabled = false
    }

    const newOptions: Options = Object.assign({}, this.options);
    this.options = newOptions;
  }

  sliderChanged(){
    if(this.value > 0){
      this.class = ''
    }else{
      this.class = ''
      this.value = 1
    }
  }


}