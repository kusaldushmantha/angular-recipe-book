import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as FromApp from "../../store/app.reducer";
import { map } from "rxjs/operators";

@Component( {
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: [ './recipe-list.component.css' ]
} )
export class RecipeListComponent implements OnInit, OnDestroy {

    recipes: Recipe[];
    recipeChangedSubscription: Subscription;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
        this.recipeChangedSubscription = this.store.select( 'recipes' )
            .pipe(
                map( recipesSate => recipesSate.recipes ) )
            .subscribe( ( recipes: Recipe[] ) => {
                this.recipes = recipes;
            } );
    }

    onNewRecipe() {
        this.router.navigate( [ 'new' ], { relativeTo: this.route } );
    }

    ngOnDestroy(): void {
        this.recipeChangedSubscription.unsubscribe();
    }
}
