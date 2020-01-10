import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SPLASH_ROUTES } from './splash.routes';
import { LayoutComponent } from './layout/layout.component';
import { RegisterLicenseComponent } from './pages/register-license/register-license.component';
import { LicenseFormComponent } from './components/license-form/license-form.component';

@NgModule({
	declarations: [
		LayoutComponent, 
		RegisterLicenseComponent, LicenseFormComponent
	],

	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(SPLASH_ROUTES)
	],

	exports: [
		LayoutComponent,
		RegisterLicenseComponent
	]
})

export class SplashModule { }
