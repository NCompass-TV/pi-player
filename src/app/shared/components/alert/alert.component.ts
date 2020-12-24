import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {

	@Input() alert_title: string;
	@Input() alert_desc: string;
	@Input() retry_count: number;
	@Input() error: boolean;
	@Input() server_status: boolean;

	constructor() { }

	ngOnInit() {
	}

}
