import { Action } from '@ngrx/store';

export const LOAD_TAXES = '[Tax] Load taxes';
export const LOAD_TAXES_SUCCESS = '[Tax] Load taxes success';
export const ADD_TAX = '[Tax] Add tax';
export const ADD_TAX_SUCCESS = '[Tax] Add tax success';
export const UPDATE_TAX = '[Tax] Update tax';
export const UPDATE_TAX_SUCCESS = '[Tax] Update tax success';
export const DELETE_TAX = '[Tax] Delete tax';
export const DELETE_TAX_SUCCESS = '[Tax] Delete tax success';

export class LoadTaxes implements Action {
  readonly type = LOAD_TAXES;
  constructor() { }
}

export class LoadTaxesSuccess implements Action {
  readonly type = LOAD_TAXES_SUCCESS;
  constructor(public payload: any) { }
}

export class AddTax implements Action {
  readonly type = ADD_TAX;
  constructor(public payload: any) { }
}

export class AddTaxSuccess implements Action {
  readonly type = ADD_TAX_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateTax implements Action {
  readonly type = UPDATE_TAX;
  constructor(public payload: any) { }
}

export class UpdateTaxSuccess implements Action {
  readonly type = UPDATE_TAX_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteTax implements Action {
  readonly type = DELETE_TAX;
  constructor(public payload: any) { }
}

export class DeleteTaxSuccess implements Action {
  readonly type = DELETE_TAX_SUCCESS;
  constructor(public payload: any) { }
}

export type TaxActions = LoadTaxes | LoadTaxesSuccess |
  AddTax | AddTaxSuccess | UpdateTax |
  UpdateTaxSuccess | DeleteTax | DeleteTaxSuccess;
