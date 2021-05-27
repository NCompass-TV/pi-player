import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { PiInfo } from '../../../models/pi-info.model';
import { License } from '../../../models/license.model';

@Component({
	selector: 'app-license-form',
	templateUrl: './license-form.component.html',
	styleUrls: ['./license-form.component.scss']
})

export class LicenseFormComponent implements OnInit {

	internal_server: boolean = false;
	is_disabled: boolean = true;
	is_submitted: boolean = false;
	license: string;
	license_exist: boolean = false;
	license_is_registered_and_activated: boolean = false;
	pi_info: any;
	register_license_form: FormGroup;
	server_error: string;
	subscription: Subscription = new Subscription;
	
	constructor(
		private _player_service: PlayerService,
		private _form: FormBuilder,
		private _router: Router
	) {}
	
	ngOnInit() {
		this.register_license_form = this._form.group(
			{
				license: ['', Validators.required]
			}
		)

		this.subscription.add(
			this.register_license_form.valueChanges.subscribe(
				data => {
					if (this.register_license_form.valid) {
						this.is_disabled = false;
					} else {
						this.is_disabled = true;
					}
				}
			)
		)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	// Convenience getter for easy access to form fields
	get f() { 
		return this.register_license_form.controls; 
	}

	// 1. On Enter License Form Submit, Check if form is valid
	onSubmit() {
		if (this.f.license.value != '') {
			this.is_submitted = true;
			this.getDeviceInfo();
		} else {
			setTimeout(() => {
				this.is_submitted = false;
			}, 4000);
		}
	}

	// 2. Pi: Get Pi Player System Info -> This is required and included on registerLicense(license_key)
	getDeviceInfo() {
		this.subscription.add(
			this._player_service.get_pi_info().subscribe(
				data => {
					this.registerLicense(this.mapPiSystemnInfo(data));
				},
				error => {
					console.log(error);
				}
			)
		)
	}

	// 3. Pi: Map Pi System Info to format data
	mapPiSystemnInfo(pi) {
		return new PiInfo (
			this.f.license.value,
			pi.macAddress ? pi.macAddress : 'N/A',
			pi.memory,
			pi.internetType,
			pi.internetSpeed,
			pi.storage.total,
			`${100 - pi.storage.used} %`,
			JSON.stringify(pi.appVersion)
		)
	}

	// 4. Dashboard Server: Check if License Exist in Server then save
	registerLicense(license_info) {
		this.subscription.add(
			this._player_service.register_license(license_info).subscribe(
				(data: License) => {
					console.log(data);
					if(data.message) {
						console.log('#LicenseFormComponent - registerLicense() - Error:', data.message);
						this.is_submitted = false;
						this.internal_server = true;
						this.license_exist = false;
						this.server_error = 'License does not exist!';
					} else {
						console.log('#LicenseFormComponent - registerLicense() - Success:', data);
						localStorage.setItem('license_id', data.licenseId);
						localStorage.setItem('license_key', data.licenseKey);
						this._router.navigate(['/setup/getting-ready']);
					}
				}, 
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#LicenseFormComponent - registerLicense() - Fatal Error:', error);
				}
			)
		)
	}
}
