import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { Observable } from 'rxjs';
import { Template } from '../../../models/template.model';

@Component({
	selector: 'app-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit {

	data$: Observable<Template[]>;

	constructor(
		private playerService: PlayerService
	) { }

	ngOnInit() {
		this.data$ = this.playerService.get_template();
		this.data$.subscribe(
			data => {
				console.log('#BackgroundComponent, #getTemplate', data);
			}
		)
	}
}
