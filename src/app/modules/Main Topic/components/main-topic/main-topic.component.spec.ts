import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MainTopicComponent } from './main-topic.component'

describe('MainTopicComponent', () => {
  let component: MainTopicComponent
  let fixture: ComponentFixture<MainTopicComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainTopicComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTopicComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
