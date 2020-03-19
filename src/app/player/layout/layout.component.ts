import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
	constructor(
		private _socket: Socket,
		private _router: Router
	) { }

	ngOnInit() {

		// Set New Socket for Socket Server
		this._socket.ioSocket.io.uri = environment.socket_server;
		
		// Connect to Socket Server
		this._socket.connect();

		this._socket.on('launch_update', () => {
			console.log('Launch Update');
			this._router.navigate(['/setup/getting-ready'], { queryParams: { update_player: true } });
		})
	}
}