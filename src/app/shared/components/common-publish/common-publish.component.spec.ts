import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CommonPublishComponent } from './common-publish.component'

describe('CommonPublishComponent', () => {
  let component: CommonPublishComponent
  let fixture: ComponentFixture<CommonPublishComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonPublishComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPublishComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
