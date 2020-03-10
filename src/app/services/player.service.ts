import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class PlayerService {
	constructor(
		private http: HttpClient,
	) { }

	clearDatabase() {
		return this.http.get(`${environment.public_url}${environment.clearDatabase}`);
	}

	hasLicense() {
		return this.http.get(`${environment.public_url}${environment.hasLicense}`);
	}

	// Register License
	registerLicense(data) {
		return this.http.post<any>(`${environment.server_url}${environment.registerLicense}`, data);
	}

	saveLicense(licensekey) {
		return this.http.post<any>(`${environment.public_url}${environment.saveLicense}${licensekey}`, null);
	}

	// Check License Activation
	getPlayerContentOnServer(licensekey) {
		return this.http.get<any>(`${environment.server_url}${environment.piDownloader}${licensekey}`);
	}

	savePlayerContentOnPi(data) {
		return this.http.post<any>(`${environment.public_url}${environment.saveData}`, data);
	}

	// Get Device Info
	getDeviceInfo() {
		return this.http.get<any>(`${environment.public_url}${environment.systemInfo}`);
	}

	// Run this if license is activated
	downloadPlayerContent() {
		return this.http.get<any>(`${environment.public_url}${environment.saveDataAndDownload}`, { reportProgress: true, observe: 'events' });
	}

	// Then get template details
	getTemplate() {
		return this.http.get<any>(`${environment.public_url}${environment.selectTemplate}`).pipe(map(data => data));
	}

	// Then get playlist sequence
	getPlaylistSequence(id) {
		return this.http.get<any>(`${environment.public_url}/select_data/playlist/${id}`).pipe(map(data => data));
	}

	// Time Checker
	getTime() {
		return this.http.get('http://worldtimeapi.org/api/ip');
	}
}
