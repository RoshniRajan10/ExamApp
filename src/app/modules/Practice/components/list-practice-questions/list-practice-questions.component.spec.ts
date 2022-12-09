import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListPracticeQuestionsComponent } from './list-practice-questions.component'

describe('ListPracticeQuestionsComponent', () => {
  let component: ListPracticeQuestionsComponent
  let fixture: ComponentFixture<ListPracticeQuestionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPracticeQuestionsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPracticeQuestionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
