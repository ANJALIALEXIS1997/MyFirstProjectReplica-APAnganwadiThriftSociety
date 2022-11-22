import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipFormComponent } from './membership-form.component';

describe('MembershipFormComponent', () => {
  let component: MembershipFormComponent;
  let fixture: ComponentFixture<MembershipFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
