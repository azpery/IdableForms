import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderItemComponent } from './form-builder-item.component';

describe('FormBuilderItemComponent', () => {
  let component: FormBuilderItemComponent;
  let fixture: ComponentFixture<FormBuilderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBuilderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
