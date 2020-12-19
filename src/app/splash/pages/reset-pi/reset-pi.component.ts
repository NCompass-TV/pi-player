import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-reset-pi',
	templateUrl: './reset-pi.component.html',
	styleUrls: ['./reset-pi.component.scss']
})

export class ResetPiComponent implements OnInit {

	subscription: Subscription = new Subscription;
	message: string;

	constructor(
		private _player: PlayerService,
		private _socket: Socket,
		private _router: Router,
		private _params: ActivatedRoute,
	) { }

	ngOnInit() {
		this._params.queryParamMap.subscribe(
			data => {
				if(data.get('refetch')) {
					this.refetchPlayerData();
				} else if(data.get('reset')) {
					this.resetPlayer();
				}
			}
		)
	}

	resetPlayer() {
		this.message = 'Resetting Player . . .'
		this._player.reset_player().subscribe(
			data => {
				setTimeout(() => {
					this._router.navigate(['/setup']);
				}, 2000)
			}
		)
	}

	refetchPlayerData() {
		this.message = 'Refetch In Progress . . .'
		this._player.refetch_player_data().subscribe(
			data => {
				setTimeout(() => {
					this._router.navigate(['/setup/getting-ready']);
				}, 2000)
			}
		)
	}
}
