import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPublishWithoutNotificationComponent } from './common-publish-without-notification.component';

describe('CommonPublishWithoutNotificationComponent', () => {
  let component: CommonPublishWithoutNotificationComponent;
  let fixture: ComponentFixture<CommonPublishWithoutNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPublishWithoutNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPublishWithoutNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
