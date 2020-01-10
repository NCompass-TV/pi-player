import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerModule } from './player/player.module';
import { SplashModule } from './splash/splash.module';
 
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		PlayerModule,
		SplashModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
