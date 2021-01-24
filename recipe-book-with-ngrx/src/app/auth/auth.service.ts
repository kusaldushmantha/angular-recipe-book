import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Store } from "@ngrx/store";
import * as FromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {

    user = new BehaviorSubject<User>( null );
    private tokenExpirationTimer: any;

    constructor( private store: Store<FromApp.AppState> ) {
    }

    setLogoutTimer( expirationDuration: number ) {
        this.tokenExpirationTimer = setTimeout( () => {
            this.store.dispatch( new AuthActions.Logout() );
        }, expirationDuration );
    }

    clearLogoutTimer() {
        if ( this.tokenExpirationTimer ) {
            clearTimeout( this.tokenExpirationTimer );
            this.tokenExpirationTimer = null;
        }
    }

}
