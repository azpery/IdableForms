import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IdablesForms';
  public spinkit = Spinkit;

  constructor(public router: Router){
    
  }

  
}
