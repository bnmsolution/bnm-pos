import { Action } from '@ngrx/store';

export const LOAD_SALES = '[Sales] Load sales';
export const LOAD_SALES_SUCCESS = '[Sales] Load sales success';

export class LoadSales implements Action {
  readonly type = LOAD_SALES;
  constructor() { }
}

export class LoadSalesSuccess implements Action {
  readonly type = LOAD_SALES_SUCCESS;
  constructor(public payload: any) { }
}

export type SalesActions = LoadSales | LoadSalesSuccess;
