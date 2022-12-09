import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddPracticeQuestionsComponent } from './add-practice-questions.component'

describe('AddPracticeQuestionsComponent', () => {
  let component: AddPracticeQuestionsComponent
  let fixture: ComponentFixture<AddPracticeQuestionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPracticeQuestionsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPracticeQuestionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
