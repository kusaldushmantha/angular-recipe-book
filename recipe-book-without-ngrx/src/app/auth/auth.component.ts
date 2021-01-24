import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { AuthResponseData } from "./auth-response-data.model";
import { Router } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component( {
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.css' ]
} )
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  alertSubscription: Subscription;
  @ViewChild( PlaceholderDirective, { static: false } ) alertHost: PlaceholderDirective;

  constructor ( private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver ) {
  }

  ngOnInit (): void {
  }

  onSwitchMode () {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit ( authForm: NgForm ) {
    if ( !authForm.valid ) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if ( this.isLoginMode ) {
      authObservable = this.authService.login( email, password )
    } else {
      authObservable = this.authService.signUp( email, password )
    }

    authObservable.subscribe( responseData => {
      console.log( responseData );
      this.isLoading = false;
      this.router.navigate( [ '/recipes' ] )
    }, errorMessage => {
      console.log( errorMessage );
      this.error = errorMessage;
      this.showErrorAlert( errorMessage );
      this.isLoading = false;
    } );

    authForm.reset();
  }

  onHandleError () {
    this.error = null;
  }

  private showErrorAlert ( message: string ) {
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

  ngOnDestroy (): void {
    if ( this.alertSubscription ) {
      this.alertSubscription.unsubscribe();
    }
  }

}