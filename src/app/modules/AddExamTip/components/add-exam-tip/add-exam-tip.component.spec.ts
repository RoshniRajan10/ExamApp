import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddExamTipComponent } from './add-exam-tip.component'

describe('AddExamTipComponent', () => {
  let component: AddExamTipComponent
  let fixture: ComponentFixture<AddExamTipComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddExamTipComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExamTipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
