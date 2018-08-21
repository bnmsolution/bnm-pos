import { Action } from '@ngrx/store';

export const LOAD_CUSTOMERS = '[Customer] Load customers';
export const LOAD_CUSTOMERS_SUCCESS = '[Customer] Load customers success';
export const ADD_CUSTOMER = '[Customer] Add customer';
export const ADD_CUSTOMER_SUCCESS = '[Customer] Add customer success';
export const UPDATE_CUSTOMER = '[Customer] Update customer';
export const UPDATE_CUSTOMER_SUCCESS = '[Customer] Update customer success';
export const DELETE_CUSTOMER = '[Customer] Delete customer';
export const DELETE_CUSTOMER_SUCCESS = '[Customer] Delete customer success';

export class LoadCustomers implements Action {
  readonly type = LOAD_CUSTOMERS;
  constructor() { }
}

export class LoadCustomersSuccess implements Action {
  readonly type = LOAD_CUSTOMERS_SUCCESS;
  constructor(public payload: any) { }
}

export class AddCustomer implements Action {
  readonly type = ADD_CUSTOMER;
  constructor(public payload: any) { }
}

export class AddCustomerSuccess implements Action {
  readonly type = ADD_CUSTOMER_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateCustomer implements Action {
  readonly type = UPDATE_CUSTOMER;
  constructor(public payload: any) { }
}

export class UpdateCustomerSuccess implements Action {
  readonly type = UPDATE_CUSTOMER_SUCCESS;
  constructor(public payload: any) { }
}

export class DeleteCustomer implements Action {
  readonly type = DELETE_CUSTOMER;
  constructor(public payload: any) { }
}

export class DeleteCustomerSuccess implements Action {
  readonly type = DELETE_CUSTOMER_SUCCESS;
  constructor(public payload: any) { }
}

export type CustomerActions = LoadCustomers | LoadCustomersSuccess |
  AddCustomer | AddCustomerSuccess | UpdateCustomer |
  UpdateCustomerSuccess | DeleteCustomer | DeleteCustomerSuccess;
