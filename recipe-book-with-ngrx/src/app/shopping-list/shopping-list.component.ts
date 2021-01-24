import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";
import { Observable } from "rxjs";
import { LoggingService } from "../logging.service";
import { Store } from "@ngrx/store";
import * as FromApp from "../store/app.reducer";
import * as  ShoppingListAction from "../shopping-list/store/shopping-list.actions"

@Component( {
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: [ './shopping-list.component.css' ]
} )
export class ShoppingListComponent implements OnInit, OnDestroy {

    ingredients: Observable<{ ingredients: Ingredient[] }>;

    constructor( private shoppingListService: ShoppingListService,
                 private loggingService: LoggingService,
                 private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
        this.ingredients = this.store.select( 'shoppingList' );
    }

    onEditItem( index: number ) {
        this.store.dispatch( new ShoppingListAction.StartEdit( index ) );
    }

    ngOnDestroy(): void {
    }
}
