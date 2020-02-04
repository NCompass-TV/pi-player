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

	// Register License
	registerLicense(data) {
		return this.http.post<any>(`${environment.server_url}${environment.registerLicense}`, data);
	}

	// Check License Activation
	downloadPlayerContent(licensekey) {
		return this.http.get<any>(`${environment.server_url}${licensekey}`);
	}

	// Get Device Info
	getDeviceInfo() {
		return this.http.get<any>(`${environment.public_url}${environment.systemInfo}`);
	}

	// Run this if license is activated
	getContent() {
		return this.http.get<any>(`${environment.public_url}/content`, { reportProgress: true, observe: 'events' }).pipe(map(data => data));
	}

	// Then get template details
	getTemplate() {
		return this.http.get<any>(`${environment.public_url}/template`).pipe(map(data => data));
	}

	// Then get playlist sequence
	getPlaylistSequence(id) {
		return this.http.get<any>(`${environment.public_url}/playlist/${id}`).pipe(map(data => data));
	}

	// Then get playlist type
	getPlaylistType(id) {
		return this.http.get<any>(`${environment.public_url}/playlist/type/${id}`).pipe(map(data => data));
	}
}
