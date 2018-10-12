import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {CustomerRoutingModule} from './customer-routing.module';
import {AddCustomerComponent} from './add-customer/add-customer.component';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {EditCustomerResolverService} from 'src/app/customer/edit-customer-resolver.service';
import {CustomerViewDialogComponent} from './customer-view-dialog/customer-view-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    CustomerRoutingModule
  ],
  providers: [
    EditCustomerResolverService
  ],
  declarations: [
    AddCustomerComponent,
    CustomerListComponent
  ]
})

export class CustomerModule {
}
