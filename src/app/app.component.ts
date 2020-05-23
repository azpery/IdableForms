import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IdablesForms';
  public spinkit = Spinkit;

  constructor(public meta: Meta,public router: Router, private titleService:Title){
    
    const keywords: MetaDefinition = {
      name: "keywords",
      content: "Climat, évolution, vidéo, questionnaire"
    }
    const description: MetaDefinition = {
      name: "description",
      content: "Ce questionnaire est une étude universitaire portant sur l'évolution du climat, une petite vidéo est à regarder, ne loupez pas l'occasion de pouvoir la visionner ! "
    }
    const img: MetaDefinition = {
      property: "og:image",
      content: "https://idableform.robin-delaporte.fr/assets/tree.jpg"
    }
    this.meta.addTags([keywords, description, img]);

    this.titleService.setTitle( "Evolution du climat." );
  }
  
}
