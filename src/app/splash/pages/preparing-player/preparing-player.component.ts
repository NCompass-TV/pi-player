import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { HasLicense } from 'src/app/models/has-license.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preparing-player',
  templateUrl: './preparing-player.component.html',
  styleUrls: ['./preparing-player.component.scss']
})
export class PreparingPlayerComponent implements OnInit {

	setup_message = [
		"Welcome! Thank you for choosing us",
		"We're setting up things for you",
		"Leave everything to us",
		"Grab yourself some popcorn",
		"They say that patience is a virtue",
		"You're all set! Player is now starting"
	];

	subscription: Subscription = new Subscription;
	showMessage: boolean = false;
	content_count: number = 0;
	download_counter: number = 0;
	download_status: number = 0;
	download_success: boolean = false;
	message_count = 0;

	constructor(
		private playerService: PlayerService,
		private router: Router,
		private _params: ActivatedRoute,
		private _http: HttpClient,
		private _socket: Socket
	) { }

	ngOnInit() {
		
		this.subscription.add(
			this._params.queryParams.subscribe(
				(q: HasLicense) => {
					console.log('hasLicense', q)
					if (q.license) {
						this.getPlayerContent(q.license);
					} else {
						this.saveLicense(localStorage.getItem('license_key'));
					}

					return false;
				}, 
				err => {
					console.log('errorHasLicense', err);
				}
			)
		)
		
		this.setupMessage();
		this._socket.on('content_to_download', (data) => {
			this.content_count = data;
			// console.log('DOWNLOAD TOTAL: ', data);
		})

		this._socket.on('downloaded_content', (data) => {
			this.download_counter = data;
			this.download_status = (this.download_counter/this.content_count) * 100;
			// console.log('DOWNLOAD COUNTER: ', data, this.download_status);
			this.downloadProgressChecker();
		})

	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	downloadProgressChecker() {
		if(this.content_count === this.download_counter) {
			this.download_success = true;
			this.setupMessage();
			setTimeout(() => {
				this.router.navigate(['/player']);
			}, 10000)
		}
	}

	setupMessage() {
		setInterval(() => {
			this.showMessage = true;
			setTimeout(() => {
				this.showMessage = false;
				if (!this.download_success) {
					if (this.message_count == this.setup_message.length - 2) {
						this.message_count = 0;
					} else {
						this.message_count += 1;
					}
				} else {
					this.showMessage = false;
					this.message_count = this.setup_message.length - 1;
				}
			}, 1000);
		}, 10000)
	}

	saveLicense(licensekey) {
		this.playerService.save_license(licensekey).subscribe(
			data => {
				console.log('#saveLicense', data);
				this.getPlayerContent(licensekey);
			},
			error => {
				this.router.navigate(['/setup/screen-saver']);
				console.log('saveLicense', error);
			}
		)
	}

	// Fetched Player Data from Server
	getPlayerContent(licensekey) {
		this.subscription.add(
			this.playerService.get_player_content_on_server(licensekey).subscribe(
				data => {
					console.log('#getPlayerContent', data);
					this.savePlayerContent(data);
				},
				error => {
					this.router.navigate(['/setup/screen-saver']);
					console.log('#getPlayerContent', error);
				}
			)
		)
	}

	// Save Fetched Content From Server to Pi
	savePlayerContent(data) {
		this.subscription.add(
			this.playerService.save_player_content_on_pi(data).subscribe(
				data => {
					console.log('#savedPlayerContent', data);
					this.downloadPlayerAssets();
				},
				error => {
					this.router.navigate(['/setup/screen-saver']);
					console.log('#savePlayerContent', error);
				}
			)
		)
	}

	downloadPlayerAssets() {
		this.subscription.add(
			this.playerService.download_player_content().subscribe(
				data => {
					console.log('#downloadPlayerAssets', data);
				}, 
				error => {
					this.router.navigate(['/setup/screen-saver']);
					console.log('#downloadPlayerAssets', error);
				}
			)
		)
	}
}
