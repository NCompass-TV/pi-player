import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {
	constructor(
		private playerService: PlayerService
	) { }

	ngOnInit() {
	}
}