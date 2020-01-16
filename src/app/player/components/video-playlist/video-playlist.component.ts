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
				console.log('Playlist Sequence', data);
				data.forEach(element => {
					this.playlist_content_array.push(element.name);
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
		this.current_video = `${environment.public_url}/${this.playlist_content_array[this.sequence_count]}`;
		console.log('playVideo', this.current_video);
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
