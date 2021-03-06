import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { StepService } from '../services/step.service'
import { Step, Media, Section } from '../models/Step';
import { FormGroup, FormControl } from '@angular/forms';
import { Form } from '../models/Form';
import { Answer } from '../models/Answer';
import { AnswerService } from '../services/answer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperComponent, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Title, MetaDefinition, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-carousel-forms',
  templateUrl: './carousel-forms.component.html',
  styleUrls: ['./carousel-forms.component.scss']
})
export class CarouselFormsComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = true;
  paused = true;
  pauseOnHover = false;
  showEndButton = false;

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: !environment.production,
    hideOnClick: false
  };
  public config: SwiperConfigInterface ;
  

  @ViewChild(SwiperComponent) carousel: SwiperComponent;

  DataForm: FormGroup = new FormGroup({});


  images = [700, 533, 807, 124,944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1900/1050`);
  
  steps:Step[];
  form: Form;



  constructor(private meta:Meta,private route:ActivatedRoute,  private stepService:StepService, private answerService:AnswerService, private router:Router, private titleService: Title ) {
    // customize default values of carousels used by this component tree

    this.stepService = stepService
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

  ngOnInit(): void {
    this.getSteps();

  }

  onSlide($event){
    this.showEndButton = $event == this.steps.length - 1
  }

  getSteps():void{
    this.stepService.getForm(this.route.snapshot.params.id ).then(data => {
      this.steps = this.pickVideo(data.steps)
      this.form = data
      this.config = {
        a11y: false,
        direction: 'horizontal',
        loop: false,
        slidesPerView: 1,
        keyboard: false,
        mousewheel: false,
        scrollbar: false,
        navigation: false,
        allowTouchMove:false,
        touchStartForcePreventDefault:true,
        touchStartPreventDefault:true,
        touchMoveStopPropagation:false,
        simulateTouch : false, 
        pagination: this.pagination,
        touchRatio:0,
        slideToClickedSlide: true,
      }
      this.titleService.setTitle( data.title.toString() );

      // this.carousel.directiveRef.setIndex(0);
    })
  }

  private pickVideo(steps){
    return steps.map(_step => {
      if(_step.content.type.toString() == 'media'){
        let media = _step.content as Media
        media.media = media.medias[Math.floor(Math.random() * media.medias.length)]
        _step.content = media
      }else if(_step.content.type.toString() == 'section'){
        let section = _step.content as Section
        section.steps = this.pickVideo(section.steps)
      }
      return _step
    }, this)
  }

  next(){
    this.carousel.directiveRef.nextSlide()
    // this.carousel.next();
  }

  submit(){
    let formInstance = Date.now();
    var result = new Array<Answer>();
    let obj = this.DataForm.value;
    this.getFlatAnswers(obj, formInstance, result);
    this.answerService.sendAnswers(result).then(data => {
      this.router.navigate(['/thankyou'])
    })
  }
  

  private getFlatAnswers(obj: any, formInstance: number, result: Answer[]) {
    for (var answer in obj)
      if (obj.hasOwnProperty(answer)) {
        if (typeof obj[answer] === 'object') {
          Object.keys(obj[answer]).forEach(key => {
            let ans = {
              form: this.form._id,
              formInstance: formInstance.toString(),
              question: key,
              answer: obj[answer][key]
            } as Answer;
            result.push(ans);
          }); 
        }else{
          let ans = {
            form: this.form._id,
            formInstance: formInstance.toString(),
            question: answer,
            answer: obj[answer]
          } as Answer;
          result.push(ans);
        }
      }
  }
}
