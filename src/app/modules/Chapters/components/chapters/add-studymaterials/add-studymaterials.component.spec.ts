import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudymaterialsComponent } from './add-studymaterials.component';

describe('AddStudymaterialsComponent', () => {
  let component: AddStudymaterialsComponent;
  let fixture: ComponentFixture<AddStudymaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudymaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudymaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
