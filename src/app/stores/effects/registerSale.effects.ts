import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { withLatestFrom, mergeMap, map, share, filter, tap } from 'rxjs/operators';

import * as registerSaleActions from '../actions/register-sale.actions';
import * as salesActions from '../actions/sales.actions';
import { RegisterSaleService } from '../../services/register-sale.service';
import * as customerActions from '../actions/customer.actions';
import { cloneDeep } from '../../shared/utils/lang';
import { MessageService } from 'src/app/services/message.service';
import { PrinterService } from 'src/app/services/printer.service';

@Injectable()
export class RegisterSaleEffects {

  // @Effect() saleChange$ = this.actions$
  //   .pipe(
  //     ofType(registerSaleActions.ADD_LINE_ITEM),
  //     withLatestFrom(this.store.select('registerSale')),
  //     map(([action, sale]) => {
  //       this.messageService.sendMessage(sale);
  //       return new registerSaleActions.AddLineItemSuccess();
  //     }),
  //   );

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
        this.messageService.sendMessage(saleCopy);
        return this.registerSaleService.closeSale(saleCopy);
      }),
      tap(sale => this.printerService.sendPrintRequest(sale)),
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
    private registerSaleService: RegisterSaleService,
    private printerService: PrinterService,
    private messageService: MessageService
  ) {
  }

  removeReferences(sale) {
    delete sale.customer;
    delete sale.employee;
  }
}
