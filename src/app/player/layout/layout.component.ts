import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

	license_id: string = localStorage.getItem('license_id');
	subscription: Subscription = new Subscription;

	constructor(
		private _socket: Socket,
		private _router: Router,
		private _player: PlayerService
	) { }

	ngOnInit() {
		// Get License ID and Key from Pi Database
		this.subscription.add(
			this._player.get_license_from_db().subscribe(
				(data: any[]) => {
					if(data.length != 0) {
						data.forEach(l => {
							console.log(l.license_id);
							this.license_id = l.license_id;
						})
					}
				}
			)
		)

		// Set New Socket for Socket Server
		this._socket.ioSocket.io.uri = environment.socket_server;
		
		// Connect to Socket Server
		this._socket.connect();

		this._socket.on('launch_update', (data) => {
			console.log('Launch Update', data);
			if (data === this.license_id) {
				this._socket.disconnect();
				this._router.navigate(['/setup/getting-ready'], { queryParams: { update_player: true } });
			} else {
				this._socket.disconnect();
			}
		})

		this._socket.on('launch_reset', (data) => {
			console.log('Launch Update', data);
			if (data === this.license_id) {
				this._socket.disconnect();
				this._router.navigate(['/setup/reset-pi']);
			} else {
				this._socket.disconnect();
			}
		})
	}
}