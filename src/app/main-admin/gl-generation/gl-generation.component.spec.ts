import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlGenerationComponent } from './gl-generation.component';

describe('GlGenerationComponent', () => {
  let component: GlGenerationComponent;
  let fixture: ComponentFixture<GlGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
