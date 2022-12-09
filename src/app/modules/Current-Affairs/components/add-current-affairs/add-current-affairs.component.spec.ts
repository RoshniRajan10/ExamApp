import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AddCurrentAffairsComponent } from './add-current-affairs.component'

describe('AddCurrentAffairsComponent', () => {
  let component: AddCurrentAffairsComponent
  let fixture: ComponentFixture<AddCurrentAffairsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCurrentAffairsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCurrentAffairsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
