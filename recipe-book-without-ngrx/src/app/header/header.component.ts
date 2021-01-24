import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from "../shared/data-storage.service";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component( {
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
} )
export class HeaderComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  isAuthenticated = false;

  constructor ( private dataStorageService: DataStorageService,
                private authService: AuthService ) {
  }

  ngOnInit (): void {
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    } );
  }

  onSaveData () {
    this.dataStorageService.storeRecipes();
  }

  onFetchData () {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy (): void {
    this.userSubscription.unsubscribe();
  }


  onLogout () {
    this.authService.logout();
  }
}
