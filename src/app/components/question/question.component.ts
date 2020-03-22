import { Component, ContentChild, Input, TemplateRef, OnInit } from '@angular/core';

import { Options, LabelType } from 'ng5-slider';
import { FormGroup, FormControl } from '@angular/forms';
import { Step, Media, Jauge } from 'src/app/models/Step';

@Component({
    selector: 'question-view',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
  })
export class QuestionComponent implements OnInit{ 
    @Input() step:Step;
    @Input() type: 'radio' | 'yesno' | 'text' | 'else' | 'jauge' | 'section' | 'media' = 'else';
    @Input() DataForm:FormGroup;

    value: number = 5;
    options: Options;

    ngOnInit() {
      if (this.type == 'radio' || this.type == 'yesno' || this.type == 'jauge' ){
      let inputName = this.step._id
      console.log(inputName)
      this.DataForm.addControl(inputName.toString(), new FormControl(''))
      }
      if(this.type == 'media' ){
        let mediaInputName = this.step._id
        let media = this.step.content as Media
        console.log(mediaInputName + '-' + media.media.name)
        this.DataForm.addControl(mediaInputName.toString(), new FormControl(media.media.name))
      }
      if(this.type == 'jauge'){
        this.options = {
          floor: 0,
          ceil: 10,
          animate:false,
          enforceStep : false,
          showTicks: true,
          showTicksValues: true,
          stepsArray: [
            {value: 1, legend: (this.step.content as Jauge).borneBasse},
            {value: 2},
            {value: 3},
            {value: 4},
            {value: 5},
            {value: 6},
            {value: 7},
            {value: 8},
            {value: 9,legend : (this.step.content as Jauge).borneHaute}
          ]
          }
      }
    }


}