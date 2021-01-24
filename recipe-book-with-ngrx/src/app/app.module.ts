import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShortenPipe } from "./shorten.pipe";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core.module";
import { LoggingService } from "./logging.service";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import * as FromApp from "./store/app.reducer.js";
import { AuthEffects } from "./auth/store/auth.effects";
import { environment } from "../environments/environment";
import { RecipeEffects } from "./recipes/store/recipe.effects";

@NgModule( {
    declarations: [
        AppComponent,
        HeaderComponent,
        ShortenPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        CoreModule,
        StoreModule.forRoot( FromApp.appReducer ),
        EffectsModule.forRoot( [ AuthEffects, RecipeEffects ] ),
        StoreDevtoolsModule.instrument( { logOnly: environment.production } )
    ],
    providers: [ LoggingService ],
    bootstrap: [ AppComponent ]
} )
export class AppModule {
}
