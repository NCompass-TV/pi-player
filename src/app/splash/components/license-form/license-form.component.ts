import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-license-form',
	templateUrl: './license-form.component.html',
	styleUrls: ['./license-form.component.scss']
})

export class LicenseFormComponent implements OnInit {

	license: string;

	constructor() { }

	ngOnInit() {

	}

	setupLicense() {
		console.log(this.license);
	}

}
