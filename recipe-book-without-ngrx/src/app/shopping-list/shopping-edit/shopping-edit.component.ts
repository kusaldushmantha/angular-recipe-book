import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component( {
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: [ './shopping-edit.component.css' ]
} )
export class ShoppingEditComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  @ViewChild( 'form', { static: false } ) shoppingListForm: NgForm;

  constructor ( private shoppingListService: ShoppingListService ) {
  }

  ngOnInit (): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe( ( index: number ) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient( index );
      this.shoppingListForm.setValue( {
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      } )
    } );
  }

  onAddOrUpdateItem ( form: NgForm ) {
    let value = form.value;
    const newIngredient = new Ingredient( value.name, value.amount );

    if ( this.editMode ) {
      this.shoppingListService.updateIngredient( this.editedItemIndex, newIngredient );
    } else {
      this.shoppingListService.addIngredient( newIngredient );
    }
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy (): void {
    this.subscription.unsubscribe();
  }

  onClear () {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete () {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
