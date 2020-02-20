import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-unactivated',
	templateUrl: './unactivated.component.html',
	styleUrls: ['./unactivated.component.scss']
})

export class UnactivatedComponent implements OnInit {

	time = new Date();
  	timer;

	constructor(
		private _player: PlayerService
	) { }

	ngOnInit() {
		this.timer = setInterval(() => {
			this.time = new Date();
		}, 1000);
	}

	ngOnDestroy(){
		clearInterval(this.timer);
	}

}
