import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedVideosComponent } from './selected-videos.component';

describe('SelectedVideosComponent', () => {
  let component: SelectedVideosComponent;
  let fixture: ComponentFixture<SelectedVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
