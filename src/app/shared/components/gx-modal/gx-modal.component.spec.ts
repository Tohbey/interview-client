import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GxModalComponent } from './gx-modal.component';

describe('GxModalComponent', () => {
  let component: GxModalComponent;
  let fixture: ComponentFixture<GxModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GxModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
