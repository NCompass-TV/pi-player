import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterLicenseComponent } from './pages/register-license/register-license.component';

export const SPLASH_ROUTES: Routes = [
	{
		path: 'setup',
		component: LayoutComponent,
        children: [
            {
                path: '',
                component: RegisterLicenseComponent
            }
        ]
    }
];
