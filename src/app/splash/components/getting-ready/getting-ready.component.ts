import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';

@Component({
	selector: 'app-getting-ready',
	templateUrl: './getting-ready.component.html',
	styleUrls: ['./getting-ready.component.scss']
})

export class GettingReadyComponent implements OnInit {

	setup_message = [
		"Welcome! Thank you for choosing us",
		"We're setting up things for you",
		"Leave everything to us",
		"Grab yourself some popcorn",
		"They say that patience is a virtue",
		"Almost there",
		"You're all set! Player is now starting"
	];

	showMessage: boolean = false;

	message_count = 0;

	constructor(
		private player: PlayerService
	) { }

	ngOnInit() {
		this.setupMessage();
		setTimeout(() => {
			this.downloadContent();
		}, 5000)
	}

	setupMessage() {
		setInterval(() => {
			this.showMessage = true;

			setTimeout(() => {
				console.log('message changed');
				this.showMessage = false;
				if (this.message_count == 4) {
					this.message_count = 0;
				} else {
					this.message_count += 1;
				}
			}, 1000);


		}, 10000)
	}

	downloadContent() {
		this.player.getContent().subscribe(
			data => {
				console.log(data);
			},
			error => {
				console.log(error);
			}
		)
	}
}
