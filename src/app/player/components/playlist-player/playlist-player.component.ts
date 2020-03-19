import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlayerService } from '../../../services/player.service';
import { Content } from '../../../models/content.model';

@Component({
	selector: 'app-playlist-player',
	templateUrl: './playlist-player.component.html',
	styleUrls: ['./playlist-player.component.scss']
})

export class PlaylistPlayerComponent implements OnInit {

	@Input() playlist_id: string;

	player_playlist_content: Content[] = [];
	player_current_content: Observable<string>;
	playlist_content_type: string;
	sequence_count: number = 0;
	slide_duration: number = 8000;

	public_url: string = `${environment.public_url}/assets`

	subscription: Subscription = new Subscription;

	constructor(
		private _player: PlayerService
	) { }

	ngOnInit() {
		this.subscription.add(
			this._player.get_playlist_sequence(this.playlist_id).subscribe(
				(data: Content[]) => {
					this.player_playlist_content = data;
					this.checkFileType(this.sequence_count);
				}
			)
		)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	// Check File Type and Play Display Content Accordingly
	checkFileType(i) {
		if (this.fileType(i) == 'webm') {
			this.displayVideo(this.fileUrl(i), this.fileType(i));
		} else if (this.fileType(i) == 'jpg' || this.fileType(i) == 'png') {
			this.displayImage(this.fileUrl(i), this.fileType(i))
		}
	}

	// Display Video Content
	displayVideo(fileurl, filetype) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype
	}

	// Display Image Content
	displayImage(fileurl, filetype) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype

		setTimeout(() => {
			if (this.sequence_count < this.player_playlist_content.length - 1) {
				this.sequence_count++;
			} else {
				this.sequence_count = 0;
			}
			this.checkFileType(this.sequence_count);
		}, this.slide_duration);
	}

	// Get Current File Url By Current Sequence
	fileUrl(i) {
		return of(`${this.public_url}/${this.player_playlist_content[i].file_name}`);
	}

	// Get Current File Type By Current Sequence
	fileType(i) {
		return this.player_playlist_content[i].file_type;
	}

	// On Video Ended Event
	onVideoEnded() {
		if (this.sequence_count++ != this.player_playlist_content.length - 1) {
			setTimeout(() => {
				this.checkFileType(this.sequence_count);
			}, 1000);
		} else {
			this.sequence_count = 0;
			setTimeout(() => {
				this.checkFileType(this.sequence_count);
			}, 1000)
		}
		return true;
	}
}
