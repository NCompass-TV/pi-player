import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingReadyComponent } from './getting-ready.component';

describe('GettingReadyComponent', () => {
  let component: GettingReadyComponent;
  let fixture: ComponentFixture<GettingReadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GettingReadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
