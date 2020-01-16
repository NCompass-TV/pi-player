import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerModule } from './player/player.module';
import { SplashModule } from './splash/splash.module';
import { PlayerService } from './services/player.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		PlayerModule,
		SplashModule,
		HttpClientModule,
		AppRoutingModule
	],
	providers: [
		PlayerService
	],
	bootstrap: [AppComponent]
})

export class AppModule { }
