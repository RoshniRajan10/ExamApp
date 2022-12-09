import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListPracticeComponent } from './list-practice.component'

describe('ListPracticeComponent', () => {
  let component: ListPracticeComponent
  let fixture: ComponentFixture<ListPracticeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPracticeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPracticeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
