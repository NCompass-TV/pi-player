import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-zone',
	templateUrl: './zone.component.html',
	styleUrls: ['./zone.component.scss']
})

export class ZoneComponent implements OnInit {

	@Input() zone_name: string;
	@Input() zone_background: string;
	@Input() zone_width: string;
	@Input() zone_height: string;
	@Input() zone_pos_x: string;
	@Input() zone_pos_y: string;

	constructor() { }

	ngOnInit() {

	}

}
