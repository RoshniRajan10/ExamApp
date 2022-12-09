import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ParentTopicComponent } from './parent-topic.component'

describe('ParentTopicComponent', () => {
  let component: ParentTopicComponent
  let fixture: ComponentFixture<ParentTopicComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParentTopicComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentTopicComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
