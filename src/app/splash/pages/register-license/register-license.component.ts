import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { SocketServer } from '../../../services/socket.service';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {

	error_title: string;
	error_description: string;
	error_exist: boolean = false;
	is_connected: boolean;
	online$: Observable<boolean>;
	reload_countdown: number = 8;
	subscription: Subscription = new Subscription;

	constructor(
		private _player_service: PlayerService,
		private _router: Router,
		private _socket: Socket,
		private _socket_server: SocketServer
	) { 
	}

	ngOnInit() {
		this._socket.ioSocket.io.uri = environment.pi_socket;
		this._socket_server.ioSocket.io.uri = environment.socket_server;;
		
		// Local Socket
		this._socket.connect();
		
		this._socket.on('connect', data => {
			console.log('Connected to Local Socket');
			this.is_connected = true;

			if (!this.error_exist) {
				this.getLicenseFromDB();
			} else {
				location.reload();
			}
		})

		this._socket.on('connect_error', () => {
			this.piServerErrorReload();
			this.error_exist = true;
			this.reload_countdown -= 1;
			if (this.reload_countdown == 0) {
				location.reload();
			}
		})

		// Socket Server
		this._socket_server.connect();

		this._socket_server.on('connect', () => {
			console.log('Connected to Socket Server')
		})

		this._socket_server.on('connect_error', error => {
			// On Init Connection Error
			this.is_connected = false;
			this.getLicenseFromDB();
		})

		this._socket_server.on('disconnect', data => {
			// On Disconnect Error
			this.is_connected = false;
			this.getLicenseFromDB();
			this._socket.disconnect();
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
		this.error_title = "Pi Server Error";
		this.error_description = "Something went wrong with the Pi Server. Please wait ...";
		this.error_exist = true;
	}


	getLicenseFromDB() {
		console.log('#getLicenseFromDB');

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
				}
			)
		)
	}
}