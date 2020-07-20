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
	}
}
