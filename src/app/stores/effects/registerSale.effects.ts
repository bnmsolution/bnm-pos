import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import {withLatestFrom, mergeMap, map, share, filter} from 'rxjs/operators';

import * as registerSaleActions from '../actions/register-sale.actions';
import * as salesActions from '../actions/sales.actions';
import {RegisterSaleService} from '../../services/register-sale.service';
import * as customerActions from '../actions/customer.actions';

@Injectable()
export class RegisterSaleEffects {

  @Effect() sales$ = this.actions$
    .ofType(salesActions.LOAD_SALES)
    .pipe(
      mergeMap(() => this.registerSaleService.getAllSales()),
      map(sales => {
        return new salesActions.LoadSalesSuccess(sales);
      })
    );

  @Effect() closeSale$ = this.actions$
    .ofType(registerSaleActions.CLOSE_SALE)
    .pipe(
      withLatestFrom(this.store.select('registerSale')),
      mergeMap(([action, sale]) => {
        this.removeReferences(sale);
        return this.registerSaleService.closeSale(sale);
      }),
      map(sale => new registerSaleActions.CloseSaleSuccess()),
      share()
    );

  @Effect() holdSale$ = this.actions$
    .ofType(registerSaleActions.HOLD_SALE)
    .pipe(
      withLatestFrom(this.store.select('registerSale')),
      mergeMap(([action, sale]) => {
        this.removeReferences(sale);
        return this.registerSaleService.holdSale(sale);
      }),
      map(sale => new registerSaleActions.HoldSaleSuccess()),
      share()
    );

  @Effect() changeStream$ = this.registerSaleService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('registerSale_') > -1),
      map(() => new salesActions.LoadSales())
    );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private registerSaleService: RegisterSaleService
  ) {
  }

  removeReferences(sale) {
    delete sale.customer;
    delete sale.employee;
  }
}
