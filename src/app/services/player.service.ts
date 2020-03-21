import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'

@Injectable({
	providedIn: 'root'
})

export class PlayerService {
	constructor(
		private http: HttpClient,
	) { }

	clear_database() {
		return this.http.get(`${environment.public_url}${environment.clearDatabase}`);
	}

	has_license() {
		return this.http.get(`${environment.public_url}${environment.hasLicense}`);
	}

	// Register License
	register_license(data) {
		return this.http.post<any>(`${environment.server_url}${environment.registerLicense}`, data);
	}

	save_license(licensekey) {
		return this.http.post<any>(`${environment.public_url}${environment.saveLicense}${licensekey}`, null);
	}

	// Check License Activation
	get_player_content_on_server(licensekey) {
		return this.http.get<any>(`${environment.server_url}${environment.piDownloader}${licensekey}`);
	}

	save_player_content_on_pi(data) {
		return this.http.post<any>(`${environment.public_url}${environment.saveData}`, data);
	}

	// Get Device Info
	get_pi_info() {
		return this.http.get<any>(`${environment.public_url}${environment.systemInfo}`);
	}

	// Run this if license is activated
	download_player_content() {
		return this.http.get<any>(`${environment.public_url}${environment.saveDataAndDownload}`, { reportProgress: true, observe: 'events' });
	}

	// Then get template details
	get_template() {
		return this.http.get<any>(`${environment.public_url}${environment.selectTemplate}`).pipe(map(data => data));
	}

	// Then get playlist sequence
	get_playlist_sequence(id) {
		return this.http.get<any>(`${environment.public_url}/select_data/playlist/${id}`).pipe(map(data => data));
	}

	// Time Checker
	get_time() {
		return this.http.get('http://worldtimeapi.org/api/ip');
	}

	// Get License from DB
	get_license_from_db() {
		return this.http.get(`${environment.public_url}${environment.getLicenseFromDb}`);
	}

	// Save License To DB
	save_license_to_db(license_data) {
		return this.http.post(`${environment.public_url}${environment.saveLicensetoDb}`, license_data);
	}
	
	reset_player() {
		return this.http.get(`${environment.public_url}${environment.resetPlayer}`);
	}
}
