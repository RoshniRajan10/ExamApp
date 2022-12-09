import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ListStudyMaterialComponent } from './list-study-material.component'

describe('ListStudyMaterialComponent', () => {
  let component: ListStudyMaterialComponent
  let fixture: ComponentFixture<ListStudyMaterialComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListStudyMaterialComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStudyMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
