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
    options: Options = {
    floor: 0,
    ceil: 10,
    animate:false,
    enforceStep : false,
    translate: (value: number, label: LabelType): string => {
      let jauge = this.step.content as Jauge
      switch (label) {
        case LabelType.Ceil:
          return '<b>'+jauge.borneHaute+'</b>' ;
        case LabelType.Floor:
          return '<b>'+jauge.borneBasse+'</b>' ;
        case LabelType.High:
          return value == 10 ? '<b>'+jauge.borneHaute+'</b>' : (value == 0 ? '<b>'+jauge.borneBasse+'</b>': (value < 5 ? '<b>Plutôt '+jauge.borneBasse+'</b>' : '<b>Plutôt '+jauge.borneHaute+'</b>'))
        case LabelType.TickValue:
          return value == 10 ? '<b>'+jauge.borneHaute+'</b>' : (value == 0 ? '<b>'+jauge.borneBasse+'</b>': (value < 5 ? '<b>Plutôt '+jauge.borneBasse+'</b>' : '<b>Plutôt '+jauge.borneHaute+'</b>'))
        case LabelType.Low:
          return value == 10 ? '<b>'+jauge.borneHaute+'</b>' : (value == 0 ? '<b>'+jauge.borneBasse+'</b>': (value < 5 ? '<b>Plutôt '+jauge.borneBasse+'</b>' : '<b>Plutôt '+jauge.borneHaute+'</b>'))
  
          default:
          return '' + value;
      }
    }
    };

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
    }


}