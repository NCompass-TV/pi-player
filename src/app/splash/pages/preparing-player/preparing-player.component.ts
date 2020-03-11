import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { HasLicense } from 'src/app/models/has-license.model';
import { Subscription } from 'rxjs';
import { PiInfo } from '../../../models/pi-info.model';

@Component({
  selector: 'app-preparing-player',
  templateUrl: './preparing-player.component.html',
  styleUrls: ['./preparing-player.component.scss']
})
export class PreparingPlayerComponent implements OnInit {

	license_key: string = localStorage.getItem('license_key');

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
	has_license: boolean = false;
	has_license_key: string;
	download_success: boolean = false;
	interval: number;
	content_count: number = 0;
	download_counter: number = 0;
	download_status: number = 0;
	message_count = 0;

	constructor(
		private _player_service: PlayerService,
		private _params: ActivatedRoute,
		private _router: Router,
		private _socket: Socket
	) { }

	ngOnInit() {
		// 1. Pi Player: Check if License already exist in Pi Player
		this.subscription.add(
			this._params.queryParams.subscribe(
				(q: HasLicense) => {
					if (q.license) {
						console.log('License already exist in this device', q)
						console.log('#PreparingPlayerComponent says License already exists in this device: ', q.license);
						this.has_license = true;
						this.has_license_key = q.license;
						this.clearDatabase();
					} else {
						console.log('#PreparingPlayerComponent this is a fresh device: ', this.license_key);
						this.clearDatabase();
					}
					return false;
				}, 
				err => {
					console.log('errorHasLicense', err);
				}
			)
		)

		// Setup Message Array is displayed
		this.setupMessage(7000);

		// Socket Connection to get current download progress
		this._socket.on('content_to_download', (data) => {
			this.content_count = data;
		})

		// Socket Connection to check if contents are downloaded successfully
		this._socket.on('downloaded_content', (data) => {
			this.download_counter = data;
			this.download_status = (this.download_counter/this.content_count) * 100;
			this.downloadProgressChecker();
		})
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	
	// Pi: Setup Display Messages
	setupMessage(interval) {
		this.interval = interval;
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
		}, this.interval)
	}


	// 2. Pi: Clear Pi Player's SQLite Database
	clearDatabase() {
		this.subscription.add(
			this._player_service.clear_database().subscribe(
				data => {
					console.log('#PreparingPlayerComponent - clearDatabase() - Success: ', data);
					if(!this.has_license) {
						this.saveLicense();
					} else {
						this.getPlayerContent(this.has_license_key);
					}
				}, 
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#PreparingPlayerComponent - clearDatabase() - Fatal Error: ', error);
				}
			)
		)
	}

	
	// 3. Pi: Save Entered License to Pi
	saveLicense() {
		this.subscription.add(
			this._player_service.save_license(this.license_key).subscribe(
				data => {
					console.log('#PreparingPlayerComponent - saveLicense() - Success: ', data);
					this.getPlayerContent(this.license_key);
				},
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#PreparingPlayerComponent - saveLicense() - Fatal Error: ', error);
				}
			)
		)
	}


	// 4. Dashboard Server: Get All Pi Player Content from Dashboard Server
	getPlayerContent(license_key) {
		this.subscription.add(
			this._player_service.get_player_content_on_server(license_key).subscribe(
				data => {
					console.log('#PreparingPlayerComponent - getPlayerContent() - Success: ', data);
					if(data.message) {
						this._router.navigate(['/setup/screen-saver']);
					} else {
						this.savePlayerContent(data);
					}
				},
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#PreparingPlayerComponent - getPlayerContent() - Fatal Error: ', error);
				}
			)
		)
	}


	// 5. Pi: Save Fetched Content from Dashboard Server to Pi Player
	savePlayerContent(data) {
		this.subscription.add(
			this._player_service.save_player_content_on_pi(data).subscribe(
				data => {
					console.log('#PreparingPlayerComponent - savePlayerContent() - Success: ', data);
					this.downloadPlayerAssets();
				},
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#PreparingPlayerComponent - savePlayerContent() - Fatal Error: ', error);
				}
			)
		)
	}


	// 6. Pi: Download Media Files to Pi Player
	downloadPlayerAssets() {
		this.subscription.add(
			this._player_service.download_player_content().subscribe(
				data => {
					console.log('#PreparingPlayerComponent - downloadPlayerAssets() - Success: ', data);
				}, 
				error => {
					// Must add redirection to Fatal Error Page...
					console.log('#PreparingPlayerComponent - downloadPlayerAssets() - Fatal Error: ', error);
				}
			)
		)
	}


	// 7. If this returns 100, means download is succesful and will redirect to player
	downloadProgressChecker() {
		if(this.content_count === this.download_counter) {
			console.log('Player Data is saved and Contents are downloaded, will now redirect to player in few seconds');
			this.download_success = true;
			this.setupMessage(12000);
			setTimeout(() => {
				this._router.navigate(['/player']);
			}, 10000)
		}
	}
}
