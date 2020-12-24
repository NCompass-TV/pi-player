import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {

	error: string;
	is_connected: boolean;
	online$: Observable<boolean>;
	reload_countdown: number = 15;
	subscription: Subscription = new Subscription;

	constructor(
		private _player_service: PlayerService,
		private _router: Router,
		private _socket: Socket
	) { }

	ngOnInit() {
		this._socket.ioSocket.io.uri = environment.socket_server;
		this._socket.connect();
		
		this._socket.on('connect', data => {
			this.is_connected = true;
			this.getLicenseFromDB();
		})

		this._socket.on('connect_error', error => {
			// On Init Connection Error
			this.is_connected = false;
			this.getLicenseFromDB();
		})

		this._socket.on('disconnect', data => {
			// On Disconnect Error
			this.is_connected = false;
			this.getLicenseFromDB();
		})
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this._socket.disconnect();
	}

	reloadTimer() {
		setTimeout(() => {
			if (this.reload_countdown > 0) {
				this.reload_countdown -= 1;
				this.reloadTimer();
			}
		}, 1000)
	}

	piServerErrorReload() {
		setTimeout(() => {
			console.log('Reloading');
			location.reload();
		}, 15000)
	}

	getLicenseFromDB() {
		this.subscription.add(
			this._player_service.get_license_from_db().subscribe(
				(data: any[]) => {
					if(data.length != 0) {
						if (this.is_connected) {
							console.log('License detected and player is online');
							this._router.navigate(['/setup/getting-ready']);
						} else {
							console.log('License detected but internet has failed, Redirecting to player');
							this._router.navigate(['/player']);
						}
					} else {
						console.log('No License Detected. Is Player Online:',  this.is_connected);
						return false;
					}
				}, 
				error => {
					console.log('#getLicenseFromDB', error);
					this.error = error.message;
					this.reloadTimer();
					this.piServerErrorReload();
				}
			)
		)
	}
}