import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListUserTipsComponent } from './list-user-tips.component'

describe('ListUserTipsComponent', () => {
  let component: ListUserTipsComponent
  let fixture: ComponentFixture<ListUserTipsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListUserTipsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserTipsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
