import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ExamLevelComponent } from './exam-level.component'

describe('ExamLevelComponent', () => {
  let component: ExamLevelComponent
  let fixture: ComponentFixture<ExamLevelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExamLevelComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamLevelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
