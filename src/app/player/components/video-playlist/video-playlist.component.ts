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

	@Input() playlist_id: string;	
	playlist_content$: Observable<Sequence[]>;
	playlist_content_array = [];
	current_video: string;
	isFullscreen: boolean = false;
	sequence_count: number = 0;

	constructor(
		private playerService: PlayerService
	) {
	}

	ngOnInit() {
		this.playerService.getPlaylistSequence(this.playlist_id).subscribe(
			data => {
				console.log(data);
				this.playlist_content_array = data;
				this.playVideo();
			}
		)
	}

	playVideo() {
		if (this.playlist_content_array[this.sequence_count].fullscreen == 1) {
			this.isFullscreen = true;
			console.log(this.isFullscreen, 'Fullscreen');
		} else {
			console.log(this.isFullscreen, 'Fullscreen');
			this.isFullscreen = false;
		}
		console.log(this.playlist_content_array);
		this.current_video = `${environment.public_url}/assets/${this.playlist_content_array[this.sequence_count].file_name}`;
	}

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
