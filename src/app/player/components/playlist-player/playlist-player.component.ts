import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlayerService } from '../../../services/player.service';
import { Content } from '../../../models/content.model';
import { VIDEO_FILETYPE, IMAGE_FILETYPE } from  '../../../models/filetype';
import { ContentLogData } from 'src/app/models/content-log.model';
import { DatePipe } from '@angular/common';
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-playlist-player',
	templateUrl: './playlist-player.component.html',
	styleUrls: ['./playlist-player.component.scss'],
	providers: [DatePipe]
})

export class PlaylistPlayerComponent implements OnInit {

	@Input() playlist_id: string;
	@Output() is_fullscreen = new EventEmitter;
	@ViewChild('videoPlayer', {static: false}) videoplayer: ElementRef;

	player_playlist_content: Content[] = [];
	player_current_content: Observable<string>;
	playlist_content_type: string;
	sequence_count: number = 0;
	license_id: string;
	replay: boolean = false;

	public_url: string = `${environment.public_url}/assets`
	subscription: Subscription = new Subscription;

	constructor(
		private _player: PlayerService,
		private _date: DatePipe,
		private _socket: Socket
	) { }

	ngOnInit() {
		this.license_id = localStorage.getItem('license_id');

		this.subscription.add(
			this._player.get_playlist_sequence(this.playlist_id).subscribe(
				(data: Content[]) => {
					const sorted_playlist = data.sort(
						(a, b) => {
							return a.sequence - b.sequence;
						}
					)
					this.player_playlist_content = sorted_playlist;
					this.checkFileType(this.sequence_count);
				}
			)
		)
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	mediaFileError(e) {
		console.log(e, this.sequence_count);
		this.sequence_count++
		this.checkFileType(this.sequence_count);
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
			this.displayImage(this.fileUrl(i), this.fileType(i), this.contentDuration(i), i)
		} else if (this.fileType(i) == 'feed') {
			if(this.isFullscreen(i) === 1) {
				this.is_fullscreen.emit(true);
			} else {
				this.is_fullscreen.emit(false);
			}
			this.displayFeed(this.player_playlist_content[i].url, this.fileType(i), this.contentDuration(i), i)
		}
	}

	// Display Video Content
	displayVideo(fileurl, filetype, i) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype

		if (i > 0) {
			if (this.player_playlist_content[i].file_name == this.player_playlist_content[i-1].file_name) {
				this.videoplayer.nativeElement.play();
			}
		}

		this.sendLogsOverSocket(this.player_playlist_content[i].content_id);
	}

	// Display Feed Content
	displayFeed(url, type, duration, i) {
		this.player_current_content = url;
		this.playlist_content_type = type;

		this.sendLogsOverSocket(this.player_playlist_content[i].content_id);

		let slide_duration = duration > 0 ? duration : 20000;

		setTimeout(() => {
			if (this.sequence_count < this.player_playlist_content.length - 1) {
				this.sequence_count++;
			} else {
				this.sequence_count = 0;
			}
			this.checkFileType(this.sequence_count);
		}, slide_duration);
	}

	// Display Image Content
	displayImage(fileurl, filetype, duration, i) {
		this.player_current_content = fileurl;
		this.playlist_content_type = filetype
		this.sendLogsOverSocket(this.player_playlist_content[i].content_id);

		let slide_duration = duration > 0 ? duration : 20000;

		setTimeout(() => {
			if (this.sequence_count < this.player_playlist_content.length - 1) {
				this.sequence_count++;
			} else {
				this.sequence_count = 0;
			}
			this.checkFileType(this.sequence_count);
		}, slide_duration);
	}

	// Get Current File Url By Current Sequence
	fileUrl(i) {
		return of(`${this.public_url}/${this.player_playlist_content[i].file_name}`);
	}

	// Get Current File Type By Current Sequence
	fileType(i) {
		return this.player_playlist_content[i].file_type;
	}

	// Get Duration of current File
	contentDuration(i) {
		return this.player_playlist_content[i].duration * 1000;
	}

	// Set Fullscreen
	isFullscreen(i) {
		return this.player_playlist_content[i].is_fullscreen;
	}

	// Send Logs via HTTPS
	saveLogToDatabase(content) {
		const date = this._date.transform(new Date(), 'y-MM-d H:mm:ss');
		let content_play_count: ContentLogData = new ContentLogData(
			this.license_id,
			content,
			date
		)

		this.subscription.add(
			this._player.save_content_play_count(content_play_count).subscribe(
				data => {
					return null;
				},
				error => {
					console.log('sendLogsOverSocket', error)
				}
			)
		)
	}

	// Send Logs via Socket
	sendLogsOverSocket(content) {
		const date = this._date.transform(new Date(), 'y-MM-d H:mm:ss');
		let content_play_count: ContentLogData = new ContentLogData(
			this.license_id,
			content,
			date
		)

		this._socket.emit('PP_logs', content_play_count);
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
