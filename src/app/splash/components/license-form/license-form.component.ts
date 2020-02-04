import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-license-form',
	templateUrl: './license-form.component.html',
	styleUrls: ['./license-form.component.scss']
})

export class LicenseFormComponent implements OnInit {

	license: string;
	license_is_registered_and_activated: boolean = false;
	pi_info: any;
	register_license_form: FormGroup;
	
	constructor(
		private playerService: PlayerService,
		private formBuilder: FormBuilder
	) {
	}

	ngOnInit() {
		this.register_license_form = this.formBuilder.group(
			{
				license: ['', Validators.required]
			}
		)
	}

	// Convenience getter for easy access to form fields
	get f() { return this.register_license_form.controls; }

	onSubmit() {
		console.log(this.f.license.value)
		this.playerService.getDeviceInfo().subscribe(
			data => {
				this.pi_info = {
					licensekey: this.f.license.value,
					macaddress: data.macaddress,
					memory: data.memory,
					internettype: data.internettype,
					internetspeed: data.internetspeed,
					totalstorage: data.storage.total,
					freestorage: `${100 - data.storage.used} %`
				}

				this.registerLicense(this.pi_info);
			},
			error => {
				console.log(error);
			}
		)
	}

	registerLicense(data) {
		this.playerService.registerLicense(data).subscribe(
			data => {
				console.log(data);
			},
			error => {
				console.log(error);
			}
		)
	}
}
