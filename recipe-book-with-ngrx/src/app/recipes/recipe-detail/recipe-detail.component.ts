import { Component, OnInit } from '@angular/core';
import { Recipe } from "../recipe.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as FromApp from "../../store/app.reducer";
import { map, switchMap } from "rxjs/operators";
import * as RecipesAction from "../store/recipe.action";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";

@Component( {
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: [ './recipe-detail.component.css' ]
} )
export class RecipeDetailComponent implements OnInit {

    recipe: Recipe;
    id: number;

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
        this.route.params.pipe(
            map( params => {
                return +params['id'];
            } ),
            switchMap( id => {
                this.id = id;
                return this.store.select( 'recipes' );
            } ),
            map( recipesState => {
                return recipesState.recipes.find( ( recipe, index ) => {
                    return index == this.id;
                } )
            } ) ).subscribe( recipe => {
            this.recipe = recipe;
        } )
    }

    onAddToShoppingList() {
        this.store.dispatch( new ShoppingListActions.AddIngredients( this.recipe.ingredients ) )
    }

    onEditRecipe() {
        this.router.navigate( [ 'edit' ], { relativeTo: this.route } );
        // this.router.navigate( [ '../' ], this.id, { relativeTo: this.route } );
    }

    onDeleteRecipe() {
        this.store.dispatch( new RecipesAction.DeleteRecipe( this.id ) )
        this.router.navigate( [ '/recipes' ] );
    }
}
