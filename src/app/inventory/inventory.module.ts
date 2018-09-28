import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {InventoryListComponent} from './inventory-list/inventory-list.component';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryFilterComponent} from './inventory-filter/inventory-filter.component';
import {InventoryResolverService} from './inventory-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    InventoryRoutingModule
  ],
  declarations: [
    InventoryListComponent,
    InventoryFilterComponent
  ],
  providers: [
    InventoryResolverService
  ]
})
export class InventoryModule {
}
