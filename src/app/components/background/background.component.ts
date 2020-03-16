import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() step;
  
  constructor() { }

  ngOnInit(): void {
  }

}
