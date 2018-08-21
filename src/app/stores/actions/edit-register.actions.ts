import { Action } from '@ngrx/store';
import { Register, RegisterTab, RegisterQuickProduct, Product } from 'pos-models';

export const LOAD_REGISTER = '[Register Edit] Add register tab';
export const ADD_REGISTER_TAB = '[Register Edit] Add register tab';
export const ADD_REGISTER_TAB_SUCCESS = '[Register Edit] Add register tab success';
export const REMOVE_REGISTER_TAB = '[Register Edit] Remove register tab';
export const REMOVE_REGISTER_TAB_SUCCESS = '[Register Edit] Remove register tab success';
export const ADD_QUICK_PRODUCT = '[Register Edit] Add quick product';
export const ADD_QUICK_PRODUCT_SUCCESS = '[Register Edit] Add quick product success';
export const UPDATE_QUICK_PRODUCT = '[Register Edit] Update quick product';
export const UPDATE_QUICK_PRODUCT_SUCCESS = '[Register Edit] Update quick product success';
export const REPOSITION_QUICK_PRODUCT = '[Register Edit] Reposition quick product';
export const REPOSITION_QUICK_PRODUCT_SUCCESS = '[Register Edit] Reposition quick product success';
export const REMOVE_QUICK_PRODUCT = '[Register Edit] Remove quick product';
export const REMOVE_QUICK_PRODUCT_SUCCESS = '[Register Edit] Remove quick product success';

export class LoadRegister implements Action {
  readonly type = LOAD_REGISTER;
  constructor(public payload: { register: Register }) { }
}

export class AddRegisterTab implements Action {
  readonly type = ADD_REGISTER_TAB;
  constructor(public payload: { tab: RegisterTab }) { }
}

export class AddRegisterTabSuccess implements Action {
  readonly type = ADD_REGISTER_TAB_SUCCESS;
  constructor(public payload: any) { }
}

export class AddQuickProduct implements Action {
  readonly type = ADD_QUICK_PRODUCT;
  constructor(public payload: {
    tabId: string, position: number,
    product: any, groupQuickProducPosition: number
  }) { }
}

export class UpdateQuickProduct implements Action {
  readonly type = UPDATE_QUICK_PRODUCT;
  constructor(public payload: {
    tabId: string, position: number,
    quickProduct: RegisterQuickProduct, groupQuickProductId: string
  }) { }
}

export class RepositionQuickProduct implements Action {
  readonly type = REPOSITION_QUICK_PRODUCT;
  constructor(public payload: {
    tabId: string, currentPosition: number, newPosition: number,
    groupQuickProductId: string
  }) { }
}

export class RemoveQuickProduct implements Action {
  readonly type = REMOVE_QUICK_PRODUCT;
  constructor(public payload: {
    tabId: string, position: number,
    groupQuickProductId: string
  }) { }
}

export type EditRegisterActions = AddRegisterTab | AddQuickProduct | UpdateQuickProduct |
  RepositionQuickProduct | RemoveQuickProduct;
