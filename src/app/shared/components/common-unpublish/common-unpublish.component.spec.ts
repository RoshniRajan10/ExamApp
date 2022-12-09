import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CommonUnpublishComponent } from './common-unpublish.component'

describe('CommonUnpublishComponent', () => {
  let component: CommonUnpublishComponent
  let fixture: ComponentFixture<CommonUnpublishComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonUnpublishComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUnpublishComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
