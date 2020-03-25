import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPiComponent } from './reset-pi.component';

describe('ResetPiComponent', () => {
  let component: ResetPiComponent;
  let fixture: ComponentFixture<ResetPiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
