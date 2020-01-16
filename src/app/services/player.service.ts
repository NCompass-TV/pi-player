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

	// Run this method on startup init
	getContent() {
		return this.http.get<any>(`${environment.public_url}/content`).pipe(map(data => data));
	}

	getTemplate() {
		return this.http.get<any>(`${environment.public_url}/template`).pipe(map(data => data));
	}

	getPlaylistSequence(id) {
		return this.http.get<any>(`${environment.public_url}/playlist/${id}`).pipe(map(data => data));
	}

	getPlaylistType(id) {
		return this.http.get<any>(`${environment.public_url}/playlist/type/${id}`).pipe(map(data => data));
	}
}