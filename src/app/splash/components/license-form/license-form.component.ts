import { Component, OnInit } from '@angular/core';
import { Content } from '../../../models/content.model';
import { PlayerService } from '../../../services/player.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-license-form',
	templateUrl: './license-form.component.html',
	styleUrls: ['./license-form.component.scss']
})

export class LicenseFormComponent implements OnInit {

	license: string;
	data$: Observable<Content[]>;

	constructor(
		private player: PlayerService
	) { 
	}

	ngOnInit() {
	}

	setupLicense() {
		this.data$ = this.player.getContent();
		this.data$.subscribe(
			(data: Content[]) => {
				data.forEach(res => {
					console.log(res.file_name);
				})
			}
		)
	}
}
