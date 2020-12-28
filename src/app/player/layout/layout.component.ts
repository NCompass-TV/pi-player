import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SocketServer } from '../../services/socket.service';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

	contentData: any;
	counter: number = 1;
	error_description: string;
	error_exist: boolean = false;
	error_title: string;
	is_closed: boolean = false;
	licenseKey: string;
	license_id: string;
	mouseXPos: number;
	reload_countdown: number = 7;
	showInfo: boolean = false;
	subscription: Subscription = new Subscription;

	constructor(
		private _player: PlayerService,
		private _socket: Socket,
		private _router: Router,
	) { 
		this._socket.ioSocket.io.uri = environment.pi_socket;

		this._socket.connect();

		this._socket.on('connect', () => {
			console.log('Connected to Local Socket')

			if (this.error_exist) {
				this.error_exist = false;
				this.reload_countdown = 7;
				location.reload();
			}
		})

		this._socket.on('connect_error', () => {
			this.alertError('Pi Server Error', 'Something went wrong with the Pi Server, will retry in a few')

			this.reload_countdown -= 1; 

			if(this.reload_countdown == 0) {
				location.reload();
			}

			console.log('Error in Pi Server')
		})
	}

	ngOnInit() {
		this.connectToSocket();
		this.getLicenseIdKey();
		this.playerDisplayInfo();
		this.triggerReset();
		this.triggerRefetch();
		this.triggerScreenshot();
		this.triggerUpdatePlayer();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this._socket.disconnect();
	}

	alertError(title, desc) {
		this.error_exist = true;
		this.error_title = title;
		this.error_description = desc;
	}

	connectToSocket() {
		this._socket.emit('electron_is_running');
		
		this._socket.on('PS_operation_closed', () => {
			this.is_closed = true;
		})

		this._socket.on('PS_operation_open', () => {
			this.is_closed = false;
		})

		this._socket.on('PS_operation_error', () => {
			console.log('There is an error with the hostinfo');
			this.is_closed = false;
		})
	}

	playerDisplayInfo() {
		this.licenseKey = localStorage.getItem('license_key');
		this.contentData = JSON.parse(localStorage.getItem('player_data'));
		fromEvent(document.body, 'mousemove').subscribe((e: MouseEvent) => {
			if (e.pageX == 0) {
				this.showInfo = true;
			}
		});
	}

	getLicenseIdKey() {
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
	}

	triggerUpdatePlayer() {
		this._socket.on('LSS_launch_update', (data) => {
			this._router.navigate(['/setup/getting-ready'], { queryParams: { update_player: true } });
		})
	}

	triggerReset() {
		this._socket.on('LSS_launch_reset', (data) => {
			console.log('Launch Reset', data);
			this._router.navigate(['/setup/reset-pi'], { queryParams: { reset: true } });
		})
	}

	triggerRefetch() {
		this._socket.on('LSS_launch_refetch', (data) => {
			console.log('Launch Refetch', data);
			this._router.navigate(['/setup/reset-pi'], { queryParams: { refetch: true } });
		})
	}

	triggerScreenshot() {
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
}