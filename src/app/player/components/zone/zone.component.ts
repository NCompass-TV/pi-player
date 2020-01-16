import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaylistTypeModel } from '../../../models/playlist-type-model.model';
import { PlayerService } from '../../../services/player.service';
import { PlaylistType } from '../../../models/playlistType';

@Component({
	selector: 'app-zone',
	templateUrl: './zone.component.html',
	styleUrls: ['./zone.component.scss']
})

export class ZoneComponent implements OnInit {

	// External
	@Input() zone_name: string;
	@Input() zone_background: string;
	@Input() zone_width: string;
	@Input() zone_height: string;
	@Input() zone_pos_x: string;
	@Input() zone_pos_y: string;
	@Input() zone_playlist_id: string;
	
	// Internal
	playlist_type$: Observable<PlaylistTypeModel[]>;

	// Playlist Types
	slides = PlaylistType.slides;
	videos = PlaylistType.videos;
	video_image = PlaylistType.video_image;

	// Identifiers
	playlist_type: string;

	constructor(
		private player: PlayerService
	) { }

	ngOnInit() {
		this.getPlaylistType();
	}

	getPlaylistType() {
		this.playlist_type$ = this.player.getPlaylistType(this.zone_playlist_id);
		this.playlist_type$.subscribe(
			(data: PlaylistTypeModel[]) => {
				data.forEach(
					element => {
						this.playlist_type = element.playlist_type;
					}
				)
			}
		)
	}
}
