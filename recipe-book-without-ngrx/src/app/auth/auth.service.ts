import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthResponseData } from "./auth-response-data.model";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  user = new BehaviorSubject<User>( null );
  private tokenExpirationTimer: any;

  constructor ( private http: HttpClient,
                private router: Router ) {
  }

  signUp ( email: string, password: string ) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      } ).pipe( catchError( this.handleError ), tap( responseData => {
      this.handleAuthentication( responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn );
    } ) );
  }

  login ( email: string, password: string ) {
    return this.http.post<AuthResponseData>( 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      } ).pipe( catchError( this.handleError ), tap( responseData => {
      this.handleAuthentication( responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn );
    } ) );
  }

  private handleAuthentication ( email: string, userId: string, token: string, expiresIn: number ) {
    const expirationDate = new Date( new Date().getTime() + expiresIn * 1000 );
    const user = new User( email, userId, token, expirationDate );
    this.user.next( user );
    this.autoLogout( expiresIn * 1000 );
    localStorage.setItem( 'userData', JSON.stringify( user ) );
  }

  private handleError ( errorRes: HttpErrorResponse ) {
    let errorMessage = 'An unknown error occurred';
    console.log( errorRes );
    if ( !errorRes.error || !errorRes.error.error ) {
      return throwError( errorMessage );
    }
    switch ( errorRes.error.error.message ) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'INVALID_PASSWORD' || 'EMAIL_NOT_FOUND':
        errorMessage = 'Email or password is incorrect';
        break;
    }
    return throwError( errorMessage );
  }

  autoLogin () {
    const userData: {
      email: string,
      id: string;
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse( localStorage.getItem( 'userData' ) );

    if ( !userData ) {
      return;
    }

    const loadedUser = new User( userData.email, userData.id, userData._token, new Date( userData._tokenExpirationDate ) );
    if ( loadedUser.token ) {
      this.user.next( loadedUser );
      const expirationDuration = new Date( userData._tokenExpirationDate ).getTime() - new Date().getTime();
      this.autoLogout( expirationDuration );
    }
  }

  autoLogout ( expirationDuration: number ) {
    this.tokenExpirationTimer = setTimeout( () => {
      this.logout();
    }, expirationDuration );
  }

logout () {
  this.user.next( null );
  this.router.navigate( [ '/auth' ] );
  localStorage.removeItem( 'userData' );

  if ( this.tokenExpirationTimer ) {
    clearTimeout( this.tokenExpirationTimer );
  }

  this.tokenExpirationTimer = null;
}

}
