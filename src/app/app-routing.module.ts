import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLicenseComponent } from './splash/pages/register-license/register-license.component';

const routes: Routes = [
	{
		path: '',
		component: RegisterLicenseComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
