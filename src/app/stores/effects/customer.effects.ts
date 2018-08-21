import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {share, mergeMap, map, filter} from 'rxjs/operators';

import * as customerActions from '../actions/customer.actions';
import {CustomerService} from 'src/app/core';

@Injectable()
export class CustomerEffects {

  @Effect() getCustomers$ = this.actions$
    .ofType(customerActions.LOAD_CUSTOMERS)
    .pipe(
      mergeMap((action: customerActions.LoadCustomers) => {
        return this.customerService.getAll();
      }),
      map(customers => new customerActions.LoadCustomersSuccess(customers))
    );

  @Effect() addCustomer$ = this.actions$
    .ofType(customerActions.ADD_CUSTOMER)
    .pipe(
      mergeMap((action: customerActions.AddCustomer) => {
        return this.customerService.addItem(action.payload);
      }),
      map(customer => new customerActions.AddCustomerSuccess(customer)),
      share()
    );

  @Effect() updateCustomer$ = this.actions$
    .ofType(customerActions.UPDATE_CUSTOMER)
    .pipe(
      mergeMap((action: customerActions.UpdateCustomer) => {
        return this.customerService.updateItem(action.payload);
      }),
      map(customer => new customerActions.UpdateCustomerSuccess(customer)),
      share()
    );

  @Effect() deleteCustomer$ = this.actions$
    .ofType(customerActions.DELETE_CUSTOMER)
    .pipe(
      mergeMap((action: customerActions.DeleteCustomer) => {
        return this.customerService.deleteItem(action.payload);
      }),
      map(customerId => new customerActions.DeleteCustomerSuccess(customerId)),
      share()
    );

  @Effect() changeStream$ = this.customerService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('customer_') > -1),
      map(() => new customerActions.LoadCustomers())
    );

  constructor(
    private actions$: Actions,
    private customerService: CustomerService
  ) {
  }
}
