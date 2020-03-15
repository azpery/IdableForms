import { Component, ContentChild, Input, TemplateRef, OnInit } from '@angular/core';

import {RadioDirective} from '../directives/radio.directive';
import {TextDirective} from '../directives/text.directive';
import {YesNoDirective} from '../directives/yesno.directive';
import { Step } from '../models/Step';

@Component({
    selector: 'question-view',
    templateUrl: './question.component.html'
  })
export class QuestionComponent implements OnInit{ 
    @Input() step;
    @Input() type: 'radio' | 'yesno' | 'text' | 'else' = 'else';
 
    // Read in our structural directives as TemplateRefs
    @ContentChild(RadioDirective, {read: TemplateRef}) radioTemplate;
    @ContentChild(TextDirective, {read: TemplateRef}) textTemplate;
    @ContentChild(YesNoDirective, {read: TemplateRef}) yesNoTemplate;

    ngOnInit() {
        console.log(this.step)
        console.log(this.type)
    }

}