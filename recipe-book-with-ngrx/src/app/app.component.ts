import { Component, OnInit } from '@angular/core';
import { LoggingService } from "./logging.service";
import { Store } from "@ngrx/store";
import * as FromApp from "./store/app.reducer";
import * as AuthActions from "./auth/store/auth.actions";

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
} )
export class AppComponent implements OnInit {

    constructor( private store: Store<FromApp.AppState>,
                 private loggingService: LoggingService ) {
    }

    ngOnInit(): void {
        this.store.dispatch( new AuthActions.AutoLogin() )
        this.loggingService.printLog( 'Hello from AppComponent ngOnInit' );
    }


}
