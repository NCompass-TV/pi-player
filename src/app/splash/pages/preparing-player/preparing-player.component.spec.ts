import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparingPlayerComponent } from './preparing-player.component';

describe('PreparingPlayerComponent', () => {
  let component: PreparingPlayerComponent;
  let fixture: ComponentFixture<PreparingPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparingPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparingPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
