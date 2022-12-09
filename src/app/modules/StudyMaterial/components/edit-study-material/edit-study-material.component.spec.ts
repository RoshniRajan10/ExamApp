import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EditStudyMaterialComponent } from './edit-study-material.component'

describe('EditStudyMaterialComponent', () => {
  let component: EditStudyMaterialComponent
  let fixture: ComponentFixture<EditStudyMaterialComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditStudyMaterialComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudyMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
