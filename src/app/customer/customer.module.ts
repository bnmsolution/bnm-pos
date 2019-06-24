import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditCustomerResolverService } from 'src/app/customer/edit-customer-resolver.service';
import { RegisterModule } from '../register';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';

@NgModule({
  imports: [
    SharedModule,
    CustomerRoutingModule,
    RegisterModule
  ],
  providers: [
    EditCustomerResolverService
  ],
  declarations: [
    CustomerListComponent,
    CustomerFilterComponent,
  ],
  exports: [
  ],
  entryComponents: [
  ]
})

export class CustomerModule {
}
