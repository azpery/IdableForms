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

  value: number = 0;
  options: Options;
  formSubmitSubject$: Subject<unknown>;
  valid = false;
  showErrorMessage = false;
  class= this.value>0?"":"hide-pointer"


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {


    if (this.type == 'radio' || this.type == 'yesno' || this.type == 'open') {
      let inputName = this.step._id
      console.log(inputName)
      this.DataForm.addControl(inputName.toString(), new FormControl('', Validators.required))
    }
    if (this.type == 'section') {
      this.subForm = new FormGroup({})
      this.DataForm.addControl(this.step._id.toString(), this.subForm)
    }
    if (this.type == 'jauge') {
      let inputName = this.step._id
      console.log(inputName)
      this.DataForm.addControl(inputName.toString(), new FormControl(null, Validators.required))
    }
    if (this.type == 'multiple') {
      let inputName = this.step._id
      console.log(inputName)
      this.DataForm.addControl(inputName.toString(), this.formBuilder.array((this.step.content as MultipleChoice).choices.map(V => { return false })))
    }
    if (this.type == 'media') {
      let mediaInputName = this.step._id
      let media = this.step.content as Media
      console.log(mediaInputName + '-' + media.media.name)
      this.DataForm.addControl(mediaInputName.toString(), new FormControl(media.media.name))
    }
    if (this.type == 'jauge') {
      this.options = {
        floor: 0,
        ceil: 10,
        animate: false,
        enforceStep: false,
        showTicks: true,
        showTicksValues: true,
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
    if (this.subForm.valid) {
      console.log(this.subForm.valid)
    }
  }


}