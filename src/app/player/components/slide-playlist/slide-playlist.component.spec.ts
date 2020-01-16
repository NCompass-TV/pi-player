import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePlaylistComponent } from './slide-playlist.component';

describe('SlidePlaylistComponent', () => {
  let component: SlidePlaylistComponent;
  let fixture: ComponentFixture<SlidePlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidePlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
