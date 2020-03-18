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
      if (this.type == 'radio' || this.type == 'yesno' || this.type == 'jauge'  ){
      let inputName = this.step._id
      console.log(inputName)
      this.DataForm.addControl(inputName, new FormControl(''))
      }
    }

}