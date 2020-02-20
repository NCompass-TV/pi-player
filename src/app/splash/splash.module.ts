import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SPLASH_ROUTES } from './splash.routes';
import { LayoutComponent } from './layout/layout.component';
import { RegisterLicenseComponent } from './pages/register-license/register-license.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreparingPlayerComponent } from './pages/preparing-player/preparing-player.component';
import { UnactivatedComponent } from './pages/unactivated/unactivated.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3215', options: {} };

@NgModule({
	declarations: [
		LayoutComponent,
		RegisterLicenseComponent, 
		LicenseFormComponent, 
		ProgressBarComponent, 
		PreparingPlayerComponent,
		UnactivatedComponent
	],

	imports: [
		CommonModule,
		FormsModule,
        ReactiveFormsModule,
		RouterModule.forChild(SPLASH_ROUTES),
		SocketIoModule.forRoot(config)
	],

	exports: [
		LayoutComponent,
		RegisterLicenseComponent
	]
})

export class SplashModule { }
