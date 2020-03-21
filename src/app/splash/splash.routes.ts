import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterLicenseComponent } from './pages/register-license/register-license.component';
import { PreparingPlayerComponent } from './pages/preparing-player/preparing-player.component';
import { UnactivatedComponent } from './pages/unactivated/unactivated.component';
import { ResetPiComponent } from './pages/reset-pi/reset-pi.component';

export const SPLASH_ROUTES: Routes = [
	{
		path: 'setup',
		component: LayoutComponent,
        children: [
            {
                path: '',
                component: RegisterLicenseComponent
            },
            {
                path: 'getting-ready',
                component: PreparingPlayerComponent
            },
            {
                path: 'screen-saver',
                component: UnactivatedComponent
            },
            {
                path: 'reset-pi',
                component: ResetPiComponent
            }
        ]
    }
];
