import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

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

  images = [700, 533, 807, 124,944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1900/1050`);

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    
  }

  ngOnInit(): void {
    this.carousel.pause();
  }

}
