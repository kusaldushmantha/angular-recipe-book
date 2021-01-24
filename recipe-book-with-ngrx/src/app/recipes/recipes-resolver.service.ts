import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import * as FromApp from "../store/app.reducer";
import * as RecipeAction from "../recipes/store/recipe.action";
import { Actions, ofType } from "@ngrx/effects";
import { map, switchMap, take } from "rxjs/operators";

@Injectable( {
    providedIn: 'root'
} )
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor( private store: Store<FromApp.AppState>,
                 private actions$: Actions ) {
    }

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
        return this.store.select( 'recipes' ).pipe(
            take( 1 ),
            map( recipeState => {
                return recipeState.recipes;
            } ),
            switchMap( recipes => {
                if ( recipes.length === 0 ) {
                    this.store.dispatch( new RecipeAction.FetchRecipes() );
                    return this.actions$.pipe( ofType( RecipeAction.SET_RECIPES ), take( 1 ) );
                } else {
                    return of( recipes );
                }
            } ) );
    }

}
