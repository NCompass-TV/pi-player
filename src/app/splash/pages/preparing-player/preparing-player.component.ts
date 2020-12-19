import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SocketServer } from '../../../services/socket.service';

@Component({
	selector: 'app-preparing-player',
	templateUrl: './preparing-player.component.html',
	styleUrls: ['./preparing-player.component.scss']
})

export class PreparingPlayerComponent implements OnInit {

	license_id: string = localStorage.getItem('license_id');
	license_key: string = localStorage.getItem('license_key');

	setup_message = [
		"Welcome to N-Compass TV",
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
	content_count: number = 0;
	download_counter: number = 0;
	download_status: number = 0;
	message_count = 0;
	is_update: boolean = false;
	is_reset: boolean = false;
	is_online: boolean = true;
	counter: number = 10;

	constructor(
		private _player_service: PlayerService,
		private _params: ActivatedRoute,
		private _router: Router,
		private _socket: Socket,
		private _socket_server: SocketServer
	) { 
		this._socket.ioSocket.io.uri = environment.pi_socket;
		
		this._socket.connect();
		this._socket.on('connect', data => {
			console.log('Connected To Local Socket')
		})

		this._socket_server.connect();
		this._socket_server.on('connect', data => {
			this.is_online = true;
			this.licenseExists();
			console.log('Connected To Socket Server');
		})


		this._socket_server.on('connect_error', error => {
			// On Init Connection Error
			console.log('Connection Error');
			this.redirectOffline();
		})
	}

	ngOnInit() {
		// If attempting an update on player content
		this.updatePlayer();

		// Setup Message Array is displayed
		this.setupMessage(8000);

		// Socket Connection to get current download progress
		this.socket_contentToDownload();

		// Socket Connection to check if contents are downloaded successfully
		this.socket_downloadedContent();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	redirectOffline() {
		this.is_online = false;

		console.log('Attempting to Connect', this.counter--);

		if (this.counter == 0) {
			this._socket.emit('PP_update_finish');
			this._router.navigate(['/player']).then(() => {
				// HOTFIX: Reload page destination to Destroy previous socket sessions
				window.location.reload();
				console.log('Redirected to Player')
			});
		}
	}

	licenseExists() {
		console.log('Checking License');
		this.subscription.add(
			this._player_service.get_license_from_db().subscribe(
				(data: any) => {
					if (data.length > 0) {
						// Update
						setTimeout(() => {
							if (this.is_online) {
								this.clearDatabase(true, data[0].license_id, data[0].license_key);
							} else {
								this.redirectOffline();
							}
						}, 3000);

					} else {
						this.clearDatabase(false, this.license_id, this.license_key)
					}
					
					this._socket.emit('PP_launch_update');
				},
				error => {
					console.log(error);
				}
			)
		)
	}

	updatePlayer() {
		this.subscription.add(
			this._params.queryParamMap.subscribe(
				data => {
					if(data.get('update_player')) {
						this.setup_message = ['Updating Player . . .'];
						this.is_update = true;
					}
				}
			)
		)
	}

	socket_contentToDownload() {
		this._socket.on('content_to_download', (data) => {
			console.log('SOCKET: CONTENT TO DOWNLOAD')
			this.content_count = data;
		})
	}

	socket_downloadedContent() {
		this._socket.on('downloaded_content', (data) => {
			console.log('SOCKET: DOWNLOADED CONTENT')
			this.download_counter = data;
			this.download_status = (this.download_counter/this.content_count) * 100;
			this.downloadProgressChecker();
		})
	}

	// Pi: Setup Display Messages
	setupMessage(interval) {
		if (!this.is_update) {
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
			}, interval)
		}
	}


	// 2. Pi: Clear Pi Player's SQLite Database
	clearDatabase(has_license: boolean, id: string, key: string) {
		this.subscription.add(
			this._player_service.clear_database().subscribe(
				data => {
					console.log('#PreparingPlayerComponent - clearDatabase() - Success: ', data);
					if(has_license) {
						// Push Update
							localStorage.setItem('license_id', id)
							localStorage.setItem('license_key', key);
							this.getPlayerContent(key);
					} else {
						// Fresh install
						this.saveLicenseToDb(this.license_id, this.license_key);
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
	saveLicenseToDb(id, key) {
		const license = { 
			license_id: id,
			license_key: key 
		};
		this.subscription.add(
			this._player_service.save_license_to_db(license).subscribe(
				data => {
					console.log('#PreparingPlayerComponent - saveLicense() - Success: ', data);
					this.getPlayerContent(this.license_key);
				},
				error => {
					console.log('License Not Saved', error);
					this._router.navigate(['/setup/screen-saver']);
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
					localStorage.setItem('player_data', JSON.stringify(data));
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
		this._socket.connect();
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
			this.setupMessage(11000);
			setTimeout(() => {
				this._socket.emit('PP_update_finish');
				this._router.navigate(['/player']).then(() => {
					// HOTFIX: Reload page destination to Destroy previous socket sessions
					window.location.reload();
					console.log('Redirected to Player')
				});
			}, 10000)
		}
	}
}
