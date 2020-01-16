import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLAYER_ROUTES } from './player.routes';
import { LayoutComponent } from './layout/layout.component';
import { BackgroundComponent } from './components/background/background.component';
import { ZoneComponent } from './components/zone/zone.component';
import { VideoPlaylistComponent } from './components/video-playlist/video-playlist.component';
import { SlidePlaylistComponent } from './components/slide-playlist/slide-playlist.component';
import { VideoImagePlaylistComponent } from './components/video-image-playlist/video-image-playlist.component';

@NgModule({
	declarations: [
		LayoutComponent,
		BackgroundComponent, 
		ZoneComponent, VideoPlaylistComponent, SlidePlaylistComponent, VideoImagePlaylistComponent
	],

	imports: [
		CommonModule,
		RouterModule.forChild(PLAYER_ROUTES)
	],

	exports: [
		LayoutComponent,
		BackgroundComponent, 
		ZoneComponent
	]
})

export class PlayerModule { }
