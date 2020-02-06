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

	constructor(private player: PlayerService) {
	}

	ngOnInit() {
		
	}
}
