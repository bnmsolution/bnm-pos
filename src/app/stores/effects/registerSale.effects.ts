import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {withLatestFrom, mergeMap, map, share, filter} from 'rxjs/operators';

import * as registerSaleActions from '../actions/register-sale.actions';
import * as salesActions from '../actions/sales.actions';
import {RegisterSaleService} from '../../services/register-sale.service';
import * as customerActions from '../actions/customer.actions';
import {cloneDeep} from '../../shared/utils/lang';

@Injectable()
export class RegisterSaleEffects {

  @Effect() sales$ = this.actions$
    .pipe(
      ofType(salesActions.LOAD_SALES),
      mergeMap(() => this.registerSaleService.getAllSales()),
      map(sales => {
        return new salesActions.LoadSalesSuccess(sales);
      })
    );

  @Effect() closeSale$ = this.actions$
    .pipe(
      ofType(registerSaleActions.CLOSE_SALE),
      withLatestFrom(this.store.select('registerSale')),
      mergeMap(([action, sale]) => {
        const saleCopy = cloneDeep(sale);
        this.removeReferences(saleCopy);
        return this.registerSaleService.closeSale(saleCopy);
      }),
      map(sale => new registerSaleActions.CloseSaleSuccess()),
      share()
    );

  @Effect() holdSale$ = this.actions$
    .pipe(
      ofType(registerSaleActions.HOLD_SALE),
      withLatestFrom(this.store.select('registerSale')),
      mergeMap(([action, sale]) => {
        const saleCopy = cloneDeep(sale);
        this.removeReferences(saleCopy);
        return this.registerSaleService.holdSale(saleCopy);
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
