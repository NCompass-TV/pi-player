import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnactivatedComponent } from './unactivated.component';

describe('UnactivatedComponent', () => {
  let component: UnactivatedComponent;
  let fixture: ComponentFixture<UnactivatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnactivatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnactivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
