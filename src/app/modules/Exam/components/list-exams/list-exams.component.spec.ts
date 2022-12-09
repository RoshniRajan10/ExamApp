import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListExamsComponent } from './list-exams.component'

describe('ListExamsComponent', () => {
  let component: ListExamsComponent
  let fixture: ComponentFixture<ListExamsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListExamsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExamsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
