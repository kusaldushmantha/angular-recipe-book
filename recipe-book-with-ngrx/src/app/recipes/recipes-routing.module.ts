import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipesComponent } from "./recipes.component";
import { AuthGuard } from "../auth/auth-guard";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipesResolverService } from "./recipes-resolver.service";

const routes: Routes = [
    {
        path: '', component: RecipesComponent, canActivate: [ AuthGuard ], children: [
            { path: '', component: RecipeStartComponent, pathMatch: 'full' },
            { path: 'new', component: RecipeEditComponent, pathMatch: 'full' },
            { path: ':id', component: RecipeDetailComponent, pathMatch: 'full', resolve: [ RecipesResolverService ] },
            { path: ':id/edit', component: RecipeEditComponent, pathMatch: 'full', resolve: [ RecipesResolverService ] }
        ]
    }
];

@NgModule( {
    imports: [ RouterModule.forChild( routes ) ],
    exports: [ RouterModule ]
} )
export class RecipesRoutingModule {

}
