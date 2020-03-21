import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { StepService } from '../services/step.service'
import { Step, Media } from '../models/Step';
import { FormGroup, FormControl } from '@angular/forms';
import { Form } from '../models/Form';
import { Answer } from '../models/Answer';
import { AnswerService } from '../services/answer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carousel-forms',
  templateUrl: './carousel-forms.component.html',
  styleUrls: ['./carousel-forms.component.scss'],
  providers: [NgbCarouselConfig]
})
export class CarouselFormsComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = true;
  paused = true;
  pauseOnHover = false;
  showEndButton = false;

  DataForm: FormGroup = new FormGroup({});


  images = [700, 533, 807, 124,944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1900/1050`);
  
  steps:Step[];
  form: Form;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(private route:ActivatedRoute, config: NgbCarouselConfig, private stepService:StepService, private answerService:AnswerService) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = this.showNavigationArrows;
    config.showNavigationIndicators = this.showNavigationIndicators;    
    config.wrap = false
    this.stepService = stepService
  }

  ngOnInit(): void {
    this.getSteps();
    console.log(this.steps);
    this.carousel.pause();
  }

  onSlide($event){
    console.log("ngb-slide-" + this.steps.length)
    this.carousel
    if($event.current == "ngb-slide-" + (this.steps.length - 1)){
      this.showEndButton = true;
    }else{
      this.showEndButton = false;
    }
    $event
  }

  getSteps():void{
    this.stepService.getForm(this.route.snapshot.params.id ).then(data => {
      console.log(data)
      this.steps = this.pickVideo(data.steps)
      this.form = data
    })
  }

  private pickVideo(steps){
    return steps.map(_step => {
      if(_step.content.type.toString() == 'media'){
        let media = _step.content as Media
        media.media = media.medias[Math.floor(Math.random() * media.medias.length)]
        _step.content = media
      }
      return _step
    })
  }

  next(){
    this.carousel.next();
  }

  submit(){
    let formInstance = Date.now();
    var result = new Array<Answer>();
    let obj = this.DataForm.value;
    for (var answer in obj) if (obj.hasOwnProperty(answer)) {
      let ans = {
        form : this.form._id,
        formInstance: formInstance.toString(),
        question: answer,
        answer:obj[answer]
      } as Answer
      console.log(answer);
      console.log(obj)
      result.push(ans);
    }
    console.log(result)
    this.answerService.sendAnswers(result)
  }
  
}
