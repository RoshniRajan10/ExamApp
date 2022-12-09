import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRestoreComponent } from './common-restore.component';

describe('CommonRestoreComponent', () => {
  let component: CommonRestoreComponent;
  let fixture: ComponentFixture<CommonRestoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonRestoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
