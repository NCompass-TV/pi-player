import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

	constructor(
		private player: PlayerService
	) { }

	ngOnInit() {
		this.player.getContent().subscribe(
			data => {
				console.log(data);
			}, 
			error => {
				console.log(error);
			}
		)
	}
}
