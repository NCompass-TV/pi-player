import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SPLASH_ROUTES } from './splash.routes';
import { LayoutComponent } from './layout/layout.component';
import { RegisterLicenseComponent } from './pages/register-license/register-license.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';
import { GettingReadyComponent } from './components/getting-ready/getting-ready.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		LayoutComponent, 
		RegisterLicenseComponent, LicenseFormComponent, GettingReadyComponent, ProgressBarComponent
	],

	imports: [
		CommonModule,
		FormsModule,
        ReactiveFormsModule,
		RouterModule.forChild(SPLASH_ROUTES)
	],

	exports: [
		LayoutComponent,
		RegisterLicenseComponent
	]
})

export class SplashModule { }
