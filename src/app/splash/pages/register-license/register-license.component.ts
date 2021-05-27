import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment';

import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { License } from 'src/app/models/license.model';
import { PiInfo } from 'src/app/models/pi-info.model';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {

	online$: Observable<boolean>;
	subscription: Subscription = new Subscription;
	is_connected: boolean;
	license_key: string;
	checking_license: boolean = true;
	license_exist: boolean = false;

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

	getLicenseFromDB() {
		this.subscription.add(
			this._player_service.get_license_from_db().subscribe(
				(data: any[]) => {
					if(data.length != 0) {
						if (this.is_connected) {
							console.log('License detected and player is online', data);
							this.license_key = data[0].license_key;
							this.license_exist = true;
							this.getDeviceInfo();
						} else {
							console.log('License detected but internet has failed, Redirecting to player');
							this._router.navigate(['/player']);
						}
					} else {
						console.log('No License Detected. Is Player Online:',  this.is_connected);
						this.checking_license = false;
						this.license_exist = false;
						return false;
					}
				}
			)
		)
	}

	// 2. Pi: Get Pi Player System Info -> This is required and included on registerLicense(license_key)
	getDeviceInfo() {
		this.subscription.add(
			this._player_service.get_pi_info().subscribe(
				data => {
					this.registerLicense(this.mapPiSystemnInfo(data));
				},
				error => {
					console.log(error);
				}
			)
		)
	}

	// 3. Pi: Map Pi System Info to format data
	mapPiSystemnInfo(pi) {
		return new PiInfo (
			this.license_key,
			pi.macAddress ? pi.macAddress : 'N/A',
			pi.memory,
			pi.internetType,
			pi.internetSpeed,
			pi.storage.total,
			`${100 - pi.storage.used} %`,
			JSON.stringify(pi.appVersion)
		)
	}

	// 4. Dashboard Server: Check if License Exist in Server then save
	registerLicense(license_info) {
		this.subscription.add(
			this._player_service.register_license(license_info).subscribe(
				(data: License) => {
					console.log(data);
					if(data.message) {
						console.log('#LicenseFormComponent - registerLicense() - Error:', data.message);
					} else {
						this._router.navigate(['/setup/getting-ready']);
					}
				}, 
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#LicenseFormComponent - registerLicense() - Fatal Error:', error);
				}
			)
		)
	}
}