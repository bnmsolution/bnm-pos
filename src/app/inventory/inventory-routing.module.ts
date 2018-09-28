import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InventoryListComponent} from './inventory-list/inventory-list.component';
import {InventoryResolverService} from './inventory-resolver.service';

const routes: Routes = [
  {
    path: ':id',
    component: InventoryListComponent,
    resolve: {
      product: InventoryResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
