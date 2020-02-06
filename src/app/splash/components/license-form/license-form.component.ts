import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-license-form',
	templateUrl: './license-form.component.html',
	styleUrls: ['./license-form.component.scss']
})

export class LicenseFormComponent implements OnInit {

	is_submitted: boolean = false;
	internal_server: boolean = false;
	server_error: string;
	license: string;
	license_is_registered_and_activated: boolean = false;
	pi_info: any;
	register_license_form: FormGroup;
	
	constructor(
		private playerService: PlayerService,
		private formBuilder: FormBuilder,
		private router: Router
	) {}

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
		this.is_submitted = true;
		if (this.f.license.value != '') {
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
					localStorage.setItem("license_key", this.f.license.value);
				},
				error => {
					console.log(error);
				}
			)
		} else {
			setTimeout(() => {
				this.is_submitted = false;
			}, 4000);
		}
	}

	registerLicense(data) {
		console.log('#registerLicense', data);
		this.playerService.registerLicense(data).subscribe(
			data => {
				console.log('#registerLicense_data', data);
				if (data.isActivated == 1) {
					console.log('License is Activated, redirecting...');
					this.router.navigate(['/setup/getting-ready']);
				} else {
					console.log('Not Activated')
				}
			},
			error => {
				console.log('#registerLicense', error);
				this.server_error = error.error;
				this.internal_server = true;
				setTimeout(() => {
					this.internal_server = false;
				}, 5000);
			}
		)
	}
}
