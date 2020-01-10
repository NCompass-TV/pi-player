import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-background',
	templateUrl: './background.component.html',
	styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit {
	main_zone = {
		name: 'Main',
		background: '#111',
		width: 1286,
		height: 896,
		pos_x: 0,
		pos_y: 0
	}

	vert_zone = {
		name: 'Vertical',
		background: '#333',
		width: 634,
		height: 896,
		pos_x: 1286,
		pos_y: 0
	}

	feed_zone = {
		name: 'Feed Zone',
		background: "#555",
		width: 1366,
		height: 184,
		pos_x: 554,
		pos_y: 896
	}

	logo_zone = {
		name: 'Logo Zone',
		background: "#777",
		width: 554,
		height: 184,
		pos_x: 0,
		pos_y: 896
	}

	constructor() { }

	ngOnInit() {

	}
}
