import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
	licenseKey: string;
	contentData: any;
	mouseXPos: number;
	showInfo: boolean = false;
	license_id: string;
	counter: number = 1;
	subscription: Subscription = new Subscription;
	is_closed: boolean = true;

	constructor(
		private _player: PlayerService,
		private _socket: Socket,
		private _router: Router,
	) { 
		this._socket.ioSocket.io.uri = environment.pi_socket;
		this._socket.connect();

		this._socket.on('connect_error', error => {
			// On Init Connection Error
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

	connectToSocket() {
		this._socket.emit('electron_is_running');
		
		this._socket.on('PS_operation_closed', data => {
			this.is_closed = true;
		})

		this._socket.on('PS_operation_open', data => {
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