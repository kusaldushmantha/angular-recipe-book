import { Recipe } from "./recipe.model";
import { Injectable } from '@angular/core';
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //
  //   new Recipe( 'Sausage Pizza',
  //     'Sausage pizza topped with mozzarella cheese',
  //     'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
  //     [
  //       new Ingredient( 'Sausage', 10 ),
  //       new Ingredient( 'Cheese', 2 ),
  //       new Ingredient( 'Flour', 5 )
  //     ] ),
  //
  //   new Recipe( 'Spicy Chicken Burger',
  //     'Spicy chicken burger with cheese',
  //     'https://www.readersdigest.ca/wp-content/uploads/2015/11/gourmet-burger-scaled.jpg',
  //     [
  //       new Ingredient( 'Chicken slice', 2 ),
  //       new Ingredient( 'Cheese', 2 ),
  //       new Ingredient( 'Buns', 2 )
  //     ] )
  //
  // ];

  private recipes: Recipe[] = [];

  constructor ( private shoppingListService: ShoppingListService ) {
  }

  setRecipes ( recipes: Recipe[] ) {
    this.recipes = recipes;
    this.recipesChanged.next( this.recipes.slice() );
  }

  getRecipes () {
    return this.recipes.slice();
  }

  getRecipe ( index: number ) {
    return this.recipes[ index ]
  }

  addIngredientsToShoppingList ( ingredients: Ingredient[] ) {
    this.shoppingListService.addIngredients( ingredients );
  }

  addRecipe ( recipe: Recipe ) {
    this.recipes.push( recipe );
    this.recipesChanged.next( this.recipes.slice() );
  }

  updateRecipe ( index: number, recipe: Recipe ) {
    this.recipes[ index ] = recipe;
    this.recipesChanged.next( this.recipes.slice() );
  }

  deleteRecipe ( index: number ) {
    this.recipes.splice( index, 1 );
    this.recipesChanged.next( this.recipes.slice() );
  }

}
