import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'form-builder-item',
  templateUrl: './form-builder-item.component.html',
  styleUrls: ['./form-builder-item.component.scss']
})
export class FormBuilderItemComponent implements OnInit {
  @Input() stepGroup:FormGroup

  public Editor = ClassicEditor;


  constructor() { }

  ngOnInit(): void {

  }

  get choices(): FormArray { return this.stepGroup.get('content').get('choices') as FormArray; }

  get content():FormGroup{ return this.stepGroup.get('content') as FormGroup}
  
  addChoice(){
    let choices = this.choices
    choices.insert(choices.length, new FormControl(''))
  }

  removeChoice(index){
    let choices = this.choices
    choices.removeAt(index)
  }

  onChange(value){
    switch (value) {
      case "radio":
        this.content.addControl('choices', new FormArray([]))
        break;
      case "section":
        this.content.addControl('steps', new FormArray([]))
      break;
      case "text":
        this.content.addControl('body', new FormControl(''))
      break;
    
      default:
        break;
    }
  }
}
