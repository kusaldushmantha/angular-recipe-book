import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as FromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component( {
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: [ './auth.component.css' ]
} )
export class AuthComponent implements OnInit, OnDestroy {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private alertSubscription: Subscription;
    private storeSubscription: Subscription;

    @ViewChild( PlaceholderDirective, { static: false } ) alertHost: PlaceholderDirective;


    constructor( private authService: AuthService,
                 private router: Router,
                 private componentFactoryResolver: ComponentFactoryResolver,
                 private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
        this.storeSubscription = this.store.select( 'auth' ).subscribe( authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;

            if ( this.error ) {
                this.showErrorAlert( this.error );
            }

        } )
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit( authForm: NgForm ) {
        if ( !authForm.valid ) {
            return;
        }

        const email = authForm.value.email;
        const password = authForm.value.password;

        this.isLoading = true;
        if ( this.isLoginMode ) {
            this.store.dispatch( new AuthActions.LoginStart( { email: email, password: password } ) );
        } else {
            this.store.dispatch( new AuthActions.SignUpStart( { email: email, password: password } ) );
        }

        authForm.reset();
    }

    onHandleError() {
        this.store.dispatch( new AuthActions.ClearError() );
    }

    ngOnDestroy(): void {
        if ( this.alertSubscription ) {
            this.alertSubscription.unsubscribe();
        }
        if ( this.storeSubscription ) {
            this.storeSubscription.unsubscribe();
        }
    }

    private showErrorAlert( message: string ) {
        let alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory( AlertComponent );
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        let alertComponentRef = hostViewContainerRef.createComponent( alertComponentFactory );
        alertComponentRef.instance.message = message;
        this.alertSubscription = alertComponentRef.instance.close.subscribe( () => {
            this.alertSubscription.unsubscribe();
            hostViewContainerRef.clear();
        } );
    }

}
