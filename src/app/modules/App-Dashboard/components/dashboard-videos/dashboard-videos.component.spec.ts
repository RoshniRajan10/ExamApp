import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVideosComponent } from './dashboard-videos.component';

describe('DashboardVideosComponent', () => {
  let component: DashboardVideosComponent;
  let fixture: ComponentFixture<DashboardVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
