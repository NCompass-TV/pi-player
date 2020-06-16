import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLAYER_ROUTES } from './player.routes';
import { LayoutComponent } from './layout/layout.component';
import { BackgroundComponent } from './components/background/background.component';
import { ZoneComponent } from './components/zone/zone.component';
import { PlaylistPlayerComponent } from './components/playlist-player/playlist-player.component';
import { IsImagePipe } from '../pipes/is-image.pipe';
import { IsVideoPipe } from '../pipes/is-video.pipe';

@NgModule({
	declarations: [
		LayoutComponent,
		BackgroundComponent, 
		ZoneComponent,
		PlaylistPlayerComponent,
		IsVideoPipe,
		IsImagePipe
	],

	imports: [
		CommonModule,
		RouterModule.forChild(PLAYER_ROUTES)
	],

	exports: [
		LayoutComponent,
		BackgroundComponent, 
		ZoneComponent,
		IsVideoPipe,
		IsImagePipe
	]
})

export class PlayerModule { }
