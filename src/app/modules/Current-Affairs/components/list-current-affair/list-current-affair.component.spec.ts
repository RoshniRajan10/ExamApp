import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListCurrentAffairComponent } from './list-current-affair.component'

describe('ListCurrentAffairComponent', () => {
  let component: ListCurrentAffairComponent
  let fixture: ComponentFixture<ListCurrentAffairComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCurrentAffairComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCurrentAffairComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
