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
		private player: PlayerService
	) { }

	ngOnInit() {
		this.getPlaylistSequence();
	}

	getPlaylistSequence() {
		this.playlist_content$ = this.player.getPlaylistSequence(this.playlist_id);
		this.playlist_content$.subscribe(
			(data: Sequence[]) => {
				data.forEach(element => {
					this.playlist_content_array.push(element.name);
					console.log(this.playlist_content_array);
					if(this.playlist_content_array.length === data.length) {
						this.displayImage();
					}
				});
			}
		)
	}

	displayImage() {
		this.current_image = `${environment.public_url}/${this.playlist_content_array[this.sequence_count]}`;
		setInterval(() => {
			if (this.sequence_count < this.playlist_content_array.length-1) {
				this.sequence_count++;
			} else {
				this.sequence_count = 0;
			}
			this.current_image = `${environment.public_url}/${this.playlist_content_array[this.sequence_count]}`;
		}, this.slide_duration);
	}
}
