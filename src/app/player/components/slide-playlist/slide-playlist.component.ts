import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Sequence } from '../../../models/sequence.model';
import { PlayerService } from '../../../services/player.service';


@Component({
	selector: 'app-slide-playlist',
	templateUrl: './slide-playlist.component.html',
	styleUrls: ['./slide-playlist.component.scss']
})

export class SlidePlaylistComponent implements OnInit {

	@Input() playlist_id: string;
	current_image: string;
	playlist_content$: Observable<Sequence[]>;
	playlist_content_array = [];
	slide_duration: number = 10000;
	sequence_count: number = 0;

	constructor(
		private playerService: PlayerService
	) { }

	ngOnInit() {
		this.playerService.getPlaylistSequence(this.playlist_id).subscribe(
			data => {
				console.log(data);
				this.playlist_content_array = data;
				this.displayImage();
			}
		)
	}

	displayImage() {
		this.current_image = decodeURIComponent(`${environment.public_url}/assets/${this.playlist_content_array[this.sequence_count].file_name}`);
		console.log('test', this.current_image);
		setInterval(() => {
			if (this.sequence_count < this.playlist_content_array.length-1) {
				this.sequence_count++;
			} else {
				this.sequence_count = 0;
			}
			this.current_image = decodeURIComponent(`${environment.public_url}/assets/${this.playlist_content_array[this.sequence_count].file_name}`);
		}, this.slide_duration);
	}
}
