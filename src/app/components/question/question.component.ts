import { Component, ContentChild, Input, TemplateRef, OnInit } from '@angular/core';

import { Options } from 'ng5-slider';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'question-view',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
  })
export class QuestionComponent implements OnInit{ 
    @Input() step;
    @Input() type: 'radio' | 'yesno' | 'text' | 'else' | 'jauge' | 'section' = 'else';
    @Input() DataForm:FormGroup;

    value: number = 5;
    options: Options = {
    floor: 0,
    ceil: 10
    };

    ngOnInit() {
      let inputName = this.step.step
      console.log(inputName)
      this.DataForm.addControl(inputName, new FormControl(''))
    }

}