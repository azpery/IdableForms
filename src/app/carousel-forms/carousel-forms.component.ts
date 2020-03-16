import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { StepService } from '../services/step.service'
import { Step } from '../models/Step';
import { QuestionComponent } from '../components/question/question.component';

@Component({
  selector: 'app-root',
  templateUrl: './carousel-forms.component.html',
  styleUrls: ['./carousel-forms.component.scss'],
  providers: [NgbCarouselConfig]
})
export class CarouselFormsComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = true;
  paused = true;
  pauseOnHover = false;

  images = [700, 533, 807, 124,944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1900/1050`);
  
  steps:Step[];

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(config: NgbCarouselConfig, private stepService:StepService) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = this.showNavigationArrows;
    config.showNavigationIndicators = this.showNavigationIndicators;    
    
  }

  ngOnInit(): void {
    this.getSteps();
    console.log(this.steps);
    this.carousel.pause();
  }

  onSlide($event){
    $event
  }

  getSteps():void{
    this.steps = this.stepService.getSteps()
  }

  next(){
    this.carousel.next();
  }

}
