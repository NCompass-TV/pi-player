import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'ng-player';

	constructor(
		private _socket: Socket,
		private _http: HttpClient
	){}


	ngOnInit() {
		this._socket.on('restart_the_pi', (data) => {
			this._http.get('http://localhost:3215/select_data/content/restart-pi').subscribe(
				data => {
					console.log(data);
				}
			)  
		})
	}
}
