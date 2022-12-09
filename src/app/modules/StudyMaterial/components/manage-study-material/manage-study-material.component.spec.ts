import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ManageStudyMaterialComponent } from './manage-study-material.component'

describe('ManageStudyMaterialComponent', () => {
  let component: ManageStudyMaterialComponent
  let fixture: ComponentFixture<ManageStudyMaterialComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageStudyMaterialComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStudyMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
