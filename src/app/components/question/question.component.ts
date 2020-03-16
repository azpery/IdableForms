import { Component, ContentChild, Input, TemplateRef, OnInit } from '@angular/core';

import { Options } from 'ng5-slider';

@Component({
    selector: 'question-view',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
  })
export class QuestionComponent implements OnInit{ 
    @Input() step;
    @Input() type: 'radio' | 'yesno' | 'text' | 'else' | 'jauge' | 'section' = 'else';

    value: number = 5;
    options: Options = {
    floor: 0,
    ceil: 10
    };

    ngOnInit() {
      console.log(this.step)
    }

}