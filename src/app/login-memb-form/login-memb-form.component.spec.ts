import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMembFormComponent } from './login-memb-form.component';

describe('LoginMembFormComponent', () => {
  let component: LoginMembFormComponent;
  let fixture: ComponentFixture<LoginMembFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginMembFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginMembFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
