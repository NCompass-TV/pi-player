import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

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
		"Almost there",
		"You're all set! Player is now starting"
	];

	showMessage: boolean = false;
	content_count: number = 0;
	download_counter: number = 0;
	download_status: number = 0;
	message_count = 0;

	constructor(
		private playerService: PlayerService,
		private router: Router,
		private _http: HttpClient,
		private _socket: Socket
	) { }

	ngOnInit() {
		this.setupMessage();
		this.saveLicense(this.license_key);
		this._socket.on('content_to_download', (data) => {
			this.content_count = data;
			console.log('DOWNLOAD TOTAL: ', data);
		})
		this._socket.on('downloaded_content', (data) => {
			this.download_counter = data;
			this.download_status = (this.download_counter/this.content_count) * 100;
			console.log('DOWNLOAD COUNTER: ', data, this.download_status);
			this.downloadProgressChecker();
		})

	}

	downloadProgressChecker() {
		if(this.content_count === this.download_counter) {
			console.log('redirecting...')
			setTimeout(() => {
				this.router.navigate(['/player']);
			}, 5000)
		}
	}

	setupMessage() {
		setInterval(() => {
			this.showMessage = true;
			setTimeout(() => {
				this.showMessage = false;
				if (this.message_count == 4) {
					this.message_count = 0;
				} else {
					this.message_count += 1;
				}
			}, 1000);
		}, 10000)
	}

	saveLicense(licensekey) {
		this.playerService.saveLicense(licensekey).subscribe(
			data => {
				console.log('#saveLicense', data);
				this.getPlayerContent(licensekey);
			},
			error => {
				console.log(error);
			}
		)
	}

	// Fetched Player Data from Server
	getPlayerContent(licensekey) {
		this.playerService.getPlayerContentOnServer(licensekey).subscribe(
			data => {
				console.log('#getPlayerContent', data);
				this.savePlayerContent(data);
			},
			error => {
				console.log('#getPlayerContent', error);
			}
		)
	}

	// Save Fetched Content From Server to Pi
	savePlayerContent(data) {
		this.playerService.savePlayerContentOnPi(data).subscribe(
			data => {
				console.log('#savedPlayerContent', data);
				this.downloadPlayerAssets();
			},
			error => {
				console.log('#savePlayerContent', error);
			}
		)
	}

	downloadPlayerAssets() {
		this.playerService.downloadPlayerContent().subscribe(
			data => {
				console.log('#downloadPlayerAssets', data);
			}, 
			error => {
				console.log('#downloadPlayerAssets', error);
			}
		)
	}
}
