import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDetaildViewComponent } from './error-detaild-view.component';

describe('ErrorDetaildViewComponent', () => {
  let component: ErrorDetaildViewComponent;
  let fixture: ComponentFixture<ErrorDetaildViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDetaildViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDetaildViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
