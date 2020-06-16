import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlayerService } from '../../../services/player.service';
import { Content } from '../../../models/content.model';
import { VIDEO_FILETYPE, IMAGE_FILETYPE } from  '../../../models/filetype';
import { ContentPlayCount } from 'src/app/models/content-play-count.model';
import { ContentLog, ContentLogData } from 'src/app/models/content-log.model';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-playlist-player',
	templateUrl: './playlist-player.component.html',
	styleUrls: ['./playlist-player.component.scss'],
	providers: [DatePipe]
})

export class PlaylistPlayerComponent implements OnInit {

	@Input() playlist_id: string;
	@Output() is_fullscreen = new EventEmitter;

	player_playlist_content: Content[] = [];
	player_current_content: Observable<string>;
	playlist_content_type: string;
	sequence_count: number = 0;
	slide_duration: number = 8000;
	license_id: string;

	public_url: string = `${environment.public_url}/assets`
	subscription: Subscription = new Subscription;

	constructor(
		private _player: PlayerService,
		private _date: DatePipe
	) { }

	ngOnInit() {
		this.license_id = localStorage.getItem('license_id');

		this.subscription.add(
			this._player.get_playlist_sequence(this.playlist_id).subscribe(
				(data: Content[]) => {
					console.log(data);
					const sorted_playlist = data.sort(
						(a, b) => {
							return a.sequence - b.sequence;
						}
					)
					// console.log('Playlist: ', this.playlist_id, 'Content', sorted_playlist);
					this.player_playlist_content = sorted_playlist;
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
		if (this.fileType(i) in VIDEO_FILETYPE) {
			this.displayVideo(this.fileUrl(i), this.fileType(i), i);
			if(this.isFullscreen(i) === 1) {
				this.is_fullscreen.emit(true);
			} else {
				this.is_fullscreen.emit(false);
			}
		} else if (this.fileType(i) in IMAGE_FILETYPE) {
			if(this.isFullscreen(i) === 1) {
				this.is_fullscreen.emit(true);
			} else {
				this.is_fullscreen.emit(false);
			}
			this.displayImage(this.fileUrl(i), this.fileType(i), i)
		}
	}

	// Display Video Content
	displayVideo(fileurl, filetype, i) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype
		this.saveLogToDatabase(this.player_playlist_content[i].content_id);
	}

	// Display Image Content
	displayImage(fileurl, filetype, i) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype
		this.saveLogToDatabase(this.player_playlist_content[i].content_id);

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

	// Set Fullscreen
	isFullscreen(i) {
		return this.player_playlist_content[i].is_fullscreen;
	}

	saveLogToDatabase(content) {
		const date = this._date.transform(new Date(), 'y-MM-d H:mm:ss');
		let content_play_count: ContentLogData = new ContentLogData(
			this.license_id,
			content,
			date
		)

		console.log(content_play_count)

		this.subscription.add(
			this._player.save_content_play_count(content_play_count).subscribe(
				data => {
					console.log('saveLogToDatabase', data);
					
				},
				error => {
					console.log('saveLogToDatabase', error)
				}
			)
		)
	}

	sendLogToBroker(content_id) {
		const date = this._date.transform(new Date(), 'short');
		const content_data: ContentLogData = new ContentLogData(
			content_id,
			date,
			this.license_id
		);

		const payload: ContentLog = new ContentLog(
			environment.kafka_topic,
			content_data
		);

		this._player.content_count_data_send_to_broker(payload).subscribe(
			data => {
				console.log('sendLogToBroker', data);
			}, 
			error => {
				console.log('sendLogToBroker', error);
			}
		)
	}

	// On Video Ended Event
	onVideoEnded() {
		if (this.sequence_count++ != this.player_playlist_content.length - 1) {
			setTimeout(() => {
				this.checkFileType(this.sequence_count);
			}, 500);
		} else {
			this.sequence_count = 0;
			setTimeout(() => {
				this.checkFileType(this.sequence_count);
			}, 500)
		}
		return true;
	}
}
