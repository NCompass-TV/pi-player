import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { HasLicense } from 'src/app/models/has-license.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register-license',
	templateUrl: './register-license.component.html',
	styleUrls: ['./register-license.component.scss']
})

export class RegisterLicenseComponent implements OnInit {
	constructor(
		private playerService: PlayerService,
		private router: Router
	) { }

	ngOnInit() {
		this.playerService.has_license().subscribe(
			(data: HasLicense) => {
				console.log('ngOnInithasLicense', data);
				if(data.has_license == true && data.license != null) {
					this.router.navigate(['/setup/getting-ready'], {queryParams: {license: data.license}});
				} else {
					return false;
				}
			}
		)
	}
}