import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'form-builder-item',
  templateUrl: './form-builder-item.component.html',
  styleUrls: ['./form-builder-item.component.scss']
})
export class FormBuilderItemComponent implements OnInit {
  @Input() stepGroup:FormGroup

  constructor() { }

  ngOnInit(): void {
    console.log(this.stepGroup)
  }

  get choices(): FormArray { return this.stepGroup.get('content').get('choices') as FormArray; }

  addChoice(){
    let choices = this.choices
    choices.insert(choices.length, new FormControl(''))
  }

  removeChoice(index){
    let choices = this.choices
    choices.removeAt(index)
  }
}
