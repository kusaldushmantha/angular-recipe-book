import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";
import { Subscription } from "rxjs";
import { LoggingService } from "../logging.service";
import { Store } from "@ngrx/store";

@Component( {
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: [ './shopping-list.component.css' ]
} )
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private ingredientChangedSubscription: Subscription;

  constructor ( private shoppingListService: ShoppingListService,
                private loggingService: LoggingService,
                private store: Store<{ shoppingList: { ingredients: Ingredient[] } }> ) {
  }

  ngOnInit (): void {
    this.store.select('shoppingList');
    this.ingredients = this.shoppingListService.getIngredients();

    this.ingredientChangedSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      ( ingredients: Ingredient[] ) => {
        this.ingredients = ingredients;
      }
    );
    this.loggingService.printLog( 'Hello from ShoppingListComponent ngOnInit' );
  }

  ngOnDestroy (): void {
    this.ingredientChangedSubscription.unsubscribe();
  }

  onEditItem ( index: number ) {
    this.shoppingListService.startedEditing.next( index );
  }
}
