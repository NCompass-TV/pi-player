import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../../../models/template.model';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit {
	
	data$: Observable<Template[]>;

	constructor(
		private _player: PlayerService
	) {}

	ngOnInit() {
		this.getTemplate();
	}

	getTemplate() {
		this.data$ = this._player.get_template();
	}
}
