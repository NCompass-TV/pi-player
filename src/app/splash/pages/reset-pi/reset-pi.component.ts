import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-reset-pi',
	templateUrl: './reset-pi.component.html',
	styleUrls: ['./reset-pi.component.scss']
})

export class ResetPiComponent implements OnInit {

	subscription: Subscription = new Subscription;

	constructor(
		private _player: PlayerService,
		private _socket: Socket,
		private _router: Router
	) { }

	ngOnInit() {
		this._player.reset_player().subscribe(
			data => {
				setTimeout(() => {
					this._router.navigate(['/setup']);
				})
			}
		)
	}
}
