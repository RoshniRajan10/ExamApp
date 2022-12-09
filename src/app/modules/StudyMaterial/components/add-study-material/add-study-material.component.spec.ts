import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddStudyMaterialComponent } from './add-study-material.component'

describe('AddStudyMaterialComponent', () => {
  let component: AddStudyMaterialComponent
  let fixture: ComponentFixture<AddStudyMaterialComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddStudyMaterialComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudyMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
