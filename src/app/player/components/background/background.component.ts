import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../../../models/template.model';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PlayerService } from '../../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit {

	license_id: string = localStorage.getItem('license_id');
	counter: number = 1;
	subscription: Subscription = new Subscription;
	data$: Observable<Template[]>;

	constructor(
		private _player: PlayerService,
		private _socket: Socket,
		private _router: Router,
	) { }

	ngOnInit() {
		this.data$ = this._player.get_template();
		
		// Set New Socket for Socket Server
		this._socket.ioSocket.io.uri = environment.socket_server;
		
		// Connect to Socket Server
		this._socket.connect();

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

		this._socket.on('launch_update', (data) => {
			console.log('Launch Update', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/getting-ready'], { queryParams: { update_player: true } });
			}
		})

		this._socket.on('status_check', (data) => {
			console.log('Status Check Event', data);
			if (data === this.license_id) {
				this._socket.emit('pi_is_online', data);
				console.log('EMITTED: pi_is_online')
			} else {
				console.log()
			}
		})

		this._socket.on('launch_reset', (data) => {
			console.log('Launch Reset', data);
			if (data === this.license_id) {
				this._router.navigate(['/setup/reset-pi']);
			}
		})

		this._socket.on('launch_screenshot', (key) => {
			console.log('LAUNCH SCREENSHOT', key, this.license_id, this.counter++);
			if (key === this.license_id) {
				this.subscription.add(
					this._player.screenShot_player().subscribe(
						data => {
							console.log(data);
						}
					)
				)
			}
		})
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this._socket.disconnect();
	}
}
