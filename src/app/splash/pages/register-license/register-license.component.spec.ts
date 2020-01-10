import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLicenseComponent } from './register-license.component';

describe('RegisterLicenseComponent', () => {
  let component: RegisterLicenseComponent;
  let fixture: ComponentFixture<RegisterLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
