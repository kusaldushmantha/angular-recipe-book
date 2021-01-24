import { Actions, Effect, ofType } from "@ngrx/effects";
import * as RecipesAction from "./recipe.action";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as FromApp from "../../store/app.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

    constructor( private  actions$: Actions,
                 private http: HttpClient,
                 private store: Store<FromApp.AppState> ) {
    }

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType( RecipesAction.FETCH_RECIPES ),
        switchMap( () => {
            return this.http.get<Recipe[]>( 'https://angular-backend-c6cef.firebaseio.com/recipes.json' );
        } ),
        map( recipes => {
            return recipes.map( recipe => {
                return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
            } );
        } ),
        map( recipes => {
            return new RecipesAction.SetRecipes( recipes );
        } )
    );

    @Effect( { dispatch: false } )
    storeRecipes = this.actions$.pipe(
        ofType( RecipesAction.STORE_RECIPES ),
        withLatestFrom( this.store.select( 'recipes' ) ),
        switchMap( ( [ actionData, recipesState ] ) => {
            return this.http.put( 'https://angular-backend-c6cef.firebaseio.com/recipes.json', recipesState.recipes )
        } ) )

}
