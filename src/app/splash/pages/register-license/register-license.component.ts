import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {

	subscription: Subscription = new Subscription;

	constructor(
		private _player_service: PlayerService,
		private _router: Router
	) { }

	ngOnInit() {
		this.getLicenseFromDB();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getLicenseFromDB() {
		this.subscription.add(
			this._player_service.get_license_from_db().subscribe(
				(data: any[]) => {
					console.log('license_from_db', data);
					if(data.length != 0) {
						this._router.navigate(['/setup/getting-ready']);
					} else {
						return false;
					}
				}
			)
		)
	}
}