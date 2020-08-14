import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-unactivated',
	templateUrl: './unactivated.component.html',
	styleUrls: ['./unactivated.component.scss']
})

export class UnactivatedComponent implements OnInit {

	day_status: string;
	day_greeting: string;
	license_id: string = localStorage.getItem('license_id');
	license_key: string = localStorage.getItem('license_key');
	subscription = new Subscription;
	time = new Date();
	timer: any;

	constructor(
		private _player: PlayerService,
		private _router: Router,
		private _socket: Socket
	) { 
		this._socket.ioSocket.io.uri = environment.pi_socket;
		this._socket.connect();
	}

	ngOnInit() {
		// Get and Set Timer Screensaver
		this.getTimeDate();

		this.socket_launchReset();

		this.socket_launchUpdate();
	
	}

	ngOnDestroy(){
		clearInterval(this.timer);
		this._socket.disconnect();
	}

	getTimeDate() {
		this.timer = setInterval(() => {
			this.time = new Date();
			this.timeOfDay(this.time.getHours());
		}, 1000);
	}

	reloadPlayer() {
		this._router.navigate(['/setup/getting-ready'])
	}

	resetPlayer() {
		this.subscription.add(
			this._player.reset_player().subscribe(
				data => {
					console.log(data);
					this._router.navigate(['/setup'])
				}
			)
		)
	}

	socket_launchReset() {
		this._socket.on('launch_reset', (data) => {
			console.log('Launch Reset', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/reset-pi']);
			}
		})
	}

	socket_launchUpdate() {
		this._socket.on('launch_update', (data) => {
			console.log('Launch Update', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/getting-ready']);
			}
		})
	}

	timeOfDay(time) {
		if (time < 12) {
			this.day_status = 'morning'
			this.day_greeting = 'Hello, Good Morning!'
		} else if (time < 18) {
			this.day_status = 'afternoon';
			this.day_greeting = 'Hello, Good Afternoon!'
		} else {
			this.day_status = 'evening';
			this.day_greeting = 'Hello, Good Evening!'
		}
	}
}
