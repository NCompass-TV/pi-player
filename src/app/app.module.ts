import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerModule } from './player/player.module';
import { SplashModule } from './splash/splash.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerService } from './services/player.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { IsImagePipe } from './pipes/is-image.pipe';
const config: SocketIoConfig = { url: environment.pi_socket, options: { autoConnect: false } };

@NgModule({
	declarations: [
		AppComponent,
		IsImagePipe
	],
	imports: [
		BrowserModule,
		PlayerModule,
		SplashModule,
		HttpClientModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		SocketIoModule.forRoot(config),
	],
	providers: [
		PlayerService
	],
	bootstrap: [AppComponent]
})

export class AppModule { 

	on(restart_ka_daw) {
		
	}
}
