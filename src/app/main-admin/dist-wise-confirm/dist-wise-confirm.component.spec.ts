import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistWiseConfirmComponent } from './dist-wise-confirm.component';

describe('DistWiseConfirmComponent', () => {
  let component: DistWiseConfirmComponent;
  let fixture: ComponentFixture<DistWiseConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistWiseConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistWiseConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
