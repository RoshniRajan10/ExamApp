import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DeleteModalPopupComponent } from './delete-modal-popup.component'

describe('DeleteModalPopupComponent', () => {
  let component: DeleteModalPopupComponent
  let fixture: ComponentFixture<DeleteModalPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteModalPopupComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
