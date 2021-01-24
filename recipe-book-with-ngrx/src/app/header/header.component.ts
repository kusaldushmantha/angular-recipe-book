import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import * as FromApp from "../store/app.reducer";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipe.action";

@Component( {
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.css' ]
} )
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor( private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
        this.userSubscription = this.store.select( "auth" )
            .pipe( map( authState => authState.user ) )
            .subscribe( user => {
                this.isAuthenticated = !!user;
            } );
    }

    onSaveData() {
        this.store.dispatch( new RecipeActions.StoreRecipes() )
    }

    onFetchData() {
        this.store.dispatch( new RecipeActions.FetchRecipes() )
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

    onLogout() {
        this.store.dispatch( new AuthActions.Logout() );
    }
}
