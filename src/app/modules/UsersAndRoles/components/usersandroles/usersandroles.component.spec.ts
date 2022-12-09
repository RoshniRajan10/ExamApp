import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersandrolesComponent } from './usersandroles.component';

describe('UsersandrolesComponent', () => {
  let component: UsersandrolesComponent;
  let fixture: ComponentFixture<UsersandrolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersandrolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersandrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
