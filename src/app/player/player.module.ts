import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLAYER_ROUTES } from './player.routes';
import { LayoutComponent } from './layout/layout.component';
import { BackgroundComponent } from './components/background/background.component';
import { ZoneComponent } from './components/zone/zone.component';

@NgModule({
	declarations: [
		LayoutComponent,
		BackgroundComponent, 
		ZoneComponent
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
