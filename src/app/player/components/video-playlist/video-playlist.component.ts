import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { Sequence } from 'src/app/models/sequence.model';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-video-playlist',
	templateUrl: './video-playlist.component.html',
	styleUrls: ['./video-playlist.component.scss']
})

export class VideoPlaylistComponent implements OnInit {

	@Input() playlist_id: any;
	playlist_content$: Observable<Sequence[]>;
	playlist_content_array = [];
	current_video: string;
	isFullscreen: boolean = false;
	sequence_count: number = 0;

	constructor(private player: PlayerService) {
	}

	ngOnInit() {
		this.playlistSequence();
	}

	// Playlist Sequence
	playlistSequence() {
		this.playlist_content$ = this.player.getPlaylistSequence(this.playlist_id);
		this.playlist_content$.subscribe(
			(data: Sequence[]) => {
				data.forEach(element => {
					this.playlist_content_array.push(
						{
							name: element.name,
							fullscreen: element.is_full_screen
						}
					);
				})
				this.playVideo();
			},
			error => {
				console.log(error);
			}
		)
	}

	// Play Video
	playVideo() {
		if (this.playlist_content_array[this.sequence_count].fullscreen == 1) {
			this.isFullscreen = true;
			console.log(this.isFullscreen, 'Fullscreen');
		} else {
			console.log(this.isFullscreen, 'Fullscreen');
			this.isFullscreen = false;
		}
		this.current_video = `${environment.public_url}/${this.playlist_content_array[this.sequence_count].name}`;
	}

	// On Video Ended
	videoEnded() {
		if(this.sequence_count++ != this.playlist_content_array.length-1) {
			setTimeout(() => {
				this.playVideo();
			}, 1000);
		} else {
			this.sequence_count = 0;
			setTimeout(() => {
				this.playVideo();
			}, 1000)
		}
		return true;
	}
}
