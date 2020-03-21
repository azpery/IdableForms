import { Component, OnInit, Input } from '@angular/core';
import { Video, Step, Media } from 'src/app/models/Step';

@Component({
  selector: 'background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() step:Step;

  media:Video
  
  constructor() { }

  ngOnInit(): void {
    let media = this.step.content as Media
    this.media = media.media
  }

}
