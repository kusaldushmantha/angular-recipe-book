import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthResponseData } from "../auth-response-data.model";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";


const handleAuthentication = ( email: string, userId: string, token: string, expiresIn: number ) => {
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000 );
    const user = new User( email, userId, token, expirationDate );
    localStorage.setItem( 'userData', JSON.stringify( user ) );

    return new AuthActions.AuthenticateSuccess( {
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    } );

};

const handleError = ( errorRes: any ) => {
    let errorMessage = 'An unknown error occurred';
    console.log( errorRes );
    if ( !errorRes.error || !errorRes.error.error ) {
        return of( new AuthActions.AuthenticateFail( errorMessage ) );
    }
    switch ( errorRes.error.error.message ) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'INVALID_PASSWORD' || 'EMAIL_NOT_FOUND':
            errorMessage = 'Email or password is incorrect';
            break;
    }
    return of( new AuthActions.AuthenticateFail( errorMessage ) );
}

@Injectable()
export class AuthEffects {

    constructor( private action$: Actions,
                 private http: HttpClient,
                 private router: Router,
                 private authService: AuthService ) {
    }

    @Effect()
    authLogin = this.action$.pipe(
        ofType( AuthActions.LOGIN_START ),
        switchMap( ( authData: AuthActions.LoginStart ) => {
            return this.http.post<AuthResponseData>( 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                } )
                .pipe(
                    tap( resData => {
                        this.authService.setLogoutTimer( +resData.expiresIn * 1000 );
                    } ),
                    map( resData => {
                        return handleAuthentication( resData.email, resData.localId, resData.idToken, +resData.expiresIn );
                    } ),
                    catchError( errorRes => {
                        return handleError( errorRes );
                    } ) )
        } )
    );

    @Effect()
    authSignUp = this.action$.pipe(
        ofType( AuthActions.SIGN_UP_START ),
        switchMap( ( signUpAction: AuthActions.SignUpStart ) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: signUpAction.payload.email,
                    password: signUpAction.payload.password,
                    returnSecureToken: true
                } )
                .pipe(
                    tap( resData => {
                        this.authService.setLogoutTimer( +resData.expiresIn * 1000 );
                    } ),
                    map( responseData => {
                        return handleAuthentication( responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn );
                    } ),
                    catchError( error => {
                        return handleError( error )
                    } ) );
        } )
    );

    @Effect( { dispatch: false } )
    authLogout = this.action$.pipe(
        ofType( AuthActions.LOGOUT ),
        tap( () => {
            this.authService.clearLogoutTimer()
            localStorage.removeItem( 'userData' )
            this.router.navigate( [ '/auth' ] )
        } )
    );

    @Effect( { dispatch: false } )
    authRedirect = this.action$.pipe(
        ofType( AuthActions.AUTHENTICATE_SUCCESS ),
        tap( ( authSuccessAction: AuthActions.AuthenticateSuccess ) => {
            if ( authSuccessAction.payload.redirect ) {
                this.router.navigate( [ '/' ] );
            }
        } )
    )

    @Effect()
    authAutoLogin = this.action$.pipe(
        ofType( AuthActions.AUTO_LOGIN ),
        map( () => {
            const userData: {
                email: string,
                id: string;
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse( localStorage.getItem( 'userData' ) );

            if ( !userData ) {
                return { type: 'DUMMY' }
            }

            const loadedUser = new User( userData.email, userData.id, userData._token, new Date( userData._tokenExpirationDate ) );
            if ( loadedUser.token ) {
                const expirationDuration = new Date( userData._tokenExpirationDate ).getTime() - new Date().getTime();
                this.authService.setLogoutTimer( expirationDuration )
                return ( new AuthActions.AuthenticateSuccess( {
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date( userData._tokenExpirationDate ),
                    redirect: false
                } ) );
            }
            return { type: 'DUMMY' }
        } )
    )
}
