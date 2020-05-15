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

  get medias(): FormArray { return this.stepGroup.get('content').get('medias') as FormArray; }
  
  addChoice(){
    let choices = this.choices
    choices.insert(choices.length, new FormControl(''))
  }

  removeChoice(index){
    let choices = this.choices
    choices.removeAt(index)
  }

  addMedia(){
    let medias = this.medias
    medias.insert(medias.length, new FormGroup(
      {
        name: new FormControl(''),
        url: new FormControl(''),
        isVideo : new FormControl(true)
      }
    ))
  }

  removeMedia(index){
    this.medias.removeAt(index)
  }

  onChange(value){
    switch (value) {
      case "radio":
      case "multiple":
        this.content.addControl('choices', new FormArray([]))
        break;
      case "section":
        this.content.addControl('steps', new FormArray([]))
      break;
      case "text":
        this.content.addControl('body', new FormControl(''))
      break;
      case "media":
        this.content.addControl('medias', new FormArray([]))
      break;
      case "jauge":
        this.content.addControl('borneHaute', new FormControl(''))
        this.content.addControl('borneBasse', new FormControl(''))
        this.content.addControl('disablable', new FormControl(false))
      break;
    
      default:
        break;
    }
  }
}
