import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  @Input() controlClass = 'bottom-center';
  @Output() next = new EventEmitter<void>();
  @Input() disabled = false;
  @Input() lastSection = false;
  showErrorMessage = false;

  constructor() { }

  ngOnInit(): void {
  }

}
