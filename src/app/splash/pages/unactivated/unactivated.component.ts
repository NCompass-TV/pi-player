import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-unactivated',
	templateUrl: './unactivated.component.html',
	styleUrls: ['./unactivated.component.scss']
})

export class UnactivatedComponent implements OnInit {

	license_id: string = localStorage.getItem('license_id');
	time = new Date();
  	timer;

	constructor(
		private _player: PlayerService,
		private _router: Router,
		private _socket: Socket
	) { }

	ngOnInit() {
		this.timer = setInterval(() => {
			this.time = new Date();
		}, 1000);

		this.getLicenseId();

		this._socket.connect();

		this._socket.on('launch_reset', (data) => {
			console.log('Launch Reset', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/reset-pi']);
				this._socket.disconnect();
			}
		})

		this._socket.on('launch_update', (data) => {
			console.log('Launch Update', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/getting-ready']);
				this._socket.disconnect();
			}
		})
	}

	ngOnDestroy(){
		clearInterval(this.timer);
	}

	getLicenseId() {
		this._player.get_license_from_db().subscribe(
			(data: any) => {
				console.log(data)
				if(data) {
					localStorage.setItem('license_id', data.license_id);
					localStorage.setItem('license_key', data.license_key);
					this._router.navigate(['/setup/getting-ready'])
				}
			}
		)
	}
}
