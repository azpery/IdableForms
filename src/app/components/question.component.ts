import { Component, ContentChild, Input, TemplateRef, OnInit } from '@angular/core';

import { Options } from 'ng5-slider';

import { Step } from '../models/Step';

@Component({
    selector: 'question-view',
    templateUrl: './question.component.html'
  })
export class QuestionComponent implements OnInit{ 
    @Input() step;
    @Input() type: 'radio' | 'yesno' | 'text' | 'else' | 'jauge' = 'else';

    value: number = 100;
    options: Options = {
    floor: 0,
    ceil: 200
    };

    ngOnInit() {
    }

}