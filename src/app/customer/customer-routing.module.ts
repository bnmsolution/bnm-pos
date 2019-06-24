import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditCustomerResolverService } from './edit-customer-resolver.service';

const routes: Routes = [
  // {
  //   path: 'add',
  //   component: AddCustomerComponent
  // },
  // {
  //   path: 'edit/:id',
  //   component: AddCustomerComponent,
  //   resolve: {
  //     editCustomer: EditCustomerResolverService
  //   }
  // },
  {
    path: '',
    component: CustomerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
