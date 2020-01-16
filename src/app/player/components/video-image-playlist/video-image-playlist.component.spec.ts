import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoImagePlaylistComponent } from './video-image-playlist.component';

describe('VideoImagePlaylistComponent', () => {
  let component: VideoImagePlaylistComponent;
  let fixture: ComponentFixture<VideoImagePlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoImagePlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoImagePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
