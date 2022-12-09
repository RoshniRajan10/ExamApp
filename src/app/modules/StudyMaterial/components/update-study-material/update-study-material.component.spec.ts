import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpdateStudyMaterialComponent } from './update-study-material.component'

describe('UpdateStudyMaterialComponent', () => {
  let component: UpdateStudyMaterialComponent
  let fixture: ComponentFixture<UpdateStudyMaterialComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateStudyMaterialComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudyMaterialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
