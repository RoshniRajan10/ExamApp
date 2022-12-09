import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ExamAppLayoutComponent } from './exam-app-layout.component'

describe('ExamAppLayoutComponent', () => {
  let component: ExamAppLayoutComponent
  let fixture: ComponentFixture<ExamAppLayoutComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExamAppLayoutComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAppLayoutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
