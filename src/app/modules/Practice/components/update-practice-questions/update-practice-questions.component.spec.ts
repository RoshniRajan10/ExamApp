import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpdatePracticeQuestionsComponent } from './update-practice-questions.component'

describe('UpdatePracticeQuestionsComponent', () => {
  let component: UpdatePracticeQuestionsComponent
  let fixture: ComponentFixture<UpdatePracticeQuestionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePracticeQuestionsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePracticeQuestionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
