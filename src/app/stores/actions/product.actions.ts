import { Action } from '@ngrx/store';

export const LOAD_PRODUCTS = '[Product] Load products';
export const LOAD_PRODUCTS_SUCCESS = '[Product] Load products success';
export const ADD_PRODUCT = '[Product] Add product';
export const ADD_PRODUCT_SUCCESS = '[Product] Add product success';
export const UPDATE_PRODUCT = '[Product] Update product';
export const UPDATE_PRODUCT_SUCCESS = '[Product] Update product success';
export const DEACTIVATE_PRODUCT = '[Product] Deactivate product';
export const DEACTIVATE_PRODUCT_SUCCESS = '[Product] Deactivate product success';

export class LoadProducts implements Action {
  readonly type = LOAD_PRODUCTS;
  constructor() { }
}

export class LoadProductsSuccess implements Action {
  readonly type = LOAD_PRODUCTS_SUCCESS;
  constructor(public payload: any) { }
}

export class AddProduct implements Action {
  readonly type = ADD_PRODUCT;
  constructor(public payload: any) { }
}

export class AddProductSuccess implements Action {
  readonly type = ADD_PRODUCT_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateProduct implements Action {
  readonly type = UPDATE_PRODUCT;
  constructor(public payload: any) { }
}

export class UpdateProductSuccess implements Action {
  readonly type = UPDATE_PRODUCT_SUCCESS;
  constructor(public payload: any) { }
}

export class DeactivateProduct implements Action {
  readonly type = DEACTIVATE_PRODUCT;
  constructor(public payload: any) { }
}

export class DeactivateProductSuccess implements Action {
  readonly type = DEACTIVATE_PRODUCT_SUCCESS;
  constructor(public payload: any) { }
}

export type ProductActions = LoadProducts | LoadProductsSuccess | AddProduct | AddProductSuccess |
  UpdateProduct | UpdateProductSuccess | DeactivateProduct | DeactivateProductSuccess;
