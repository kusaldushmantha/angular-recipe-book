import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as FromApp from "../../store/app.reducer";

@Component( {
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: [ './shopping-edit.component.css' ]
} )
export class ShoppingEditComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    editMode: boolean = false;
    editedItem: Ingredient;

    @ViewChild( 'form', { static: false } ) shoppingListForm: NgForm;

    constructor( private shoppingListService: ShoppingListService,
                 private store: Store<FromApp.AppState> ) {
    }

    ngOnInit(): void {
this.subscription = this.store.select( 'shoppingList' ).subscribe( stateData => {
    if ( stateData.editedIngredientIndex > -1 ) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue( {
            name: this.editedItem.name,
            amount: this.editedItem.amount,
        } )
    } else {
        this.editMode = false;
    }
} );
    }

    onAddOrUpdateItem( form: NgForm ) {
        let value = form.value;
        const newIngredient = new Ingredient( value.name, value.amount );

        if ( this.editMode ) {
            this.store.dispatch( new ShoppingListActions.UpdateIngredient( newIngredient ) );
        } else {
            this.store.dispatch( new ShoppingListActions.AddIngredient( newIngredient ) )
        }
        this.editMode = false;
        form.reset();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch( new ShoppingListActions.StopEdit() );
    }

    onClear() {
        this.shoppingListForm.reset();
        this.editMode = false;
        this.store.dispatch( new ShoppingListActions.StopEdit() );
    }

    onDelete() {
        this.store.dispatch( new ShoppingListActions.DeleteIngredient() );
        this.onClear();
    }
}
