import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPracticesComponent } from './add-practices.component';

describe('AddPracticesComponent', () => {
  let component: AddPracticesComponent;
  let fixture: ComponentFixture<AddPracticesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPracticesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPracticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
