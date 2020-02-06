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

	constructor(
		private playerService: PlayerService
	) { }

	ngOnInit() {
	}
}
