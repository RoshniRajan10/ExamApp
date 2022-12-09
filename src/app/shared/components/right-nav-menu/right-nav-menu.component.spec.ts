import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RightNavMenuComponent } from './right-nav-menu.component'

describe('RightNavMenuComponent', () => {
  let component: RightNavMenuComponent
  let fixture: ComponentFixture<RightNavMenuComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RightNavMenuComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RightNavMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
