import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRandomQuestionsByTagComponent } from './select-random-questions-by-tag.component';

describe('SelectRandomQuestionsByTagComponent', () => {
  let component: SelectRandomQuestionsByTagComponent;
  let fixture: ComponentFixture<SelectRandomQuestionsByTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRandomQuestionsByTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRandomQuestionsByTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
