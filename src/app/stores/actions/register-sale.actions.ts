import { Action } from '@ngrx/store';
import {
  Register, RegisterSale, Product, PaymentType, Customer,
  PriceAdjustmentType, DiscountMethod, DiscountCalculateMethod
} from 'pos-models';

export const SELECT_REGISTER = '[Register Sale] Select register';
export const CREATE_SALE = '[Register Sale] Create sale';
export const UPDATE_SALE = '[Register Sale] Update sale';
export const CLOSE_SALE = '[Register Sale] Close sale';
export const CLOSE_SALE_SUCCESS = '[Register Sale] Close sale success';
export const ADD_LINE_ITEM = '[Register Sale] Add line item';
export const ADD_LINE_ITEM_SUCCESS = '[Register Sale] Add line item success';
export const UPDATE_LINE_ITEM_QUANTITY = '[Register Sale] Update line item quantity';
export const UPDATE_LINE_ITEM_ADDONS = '[Register Sale] Update line item addons';
export const REMOVE_LINE_ITEM = '[Register Sale] Remove line item';
export const ADD_PAYMENT = '[Register Sale] Add payment';
export const REMOVE_PAYMENT = '[Register Sale] Remove payment';
export const HOLD_SALE = '[Register Sale] Hold sale';
export const HOLD_SALE_SUCCESS = '[Register Sale] Hold sale success';
export const VOID_SALE = '[Register Sale] Void sale';
export const ADD_SALE_CUSTOMER = '[Register Sale] Add customer';
export const REMOVE_SALE_CUSTOMER = '[Register Sale] Remove customer';
export const CALCULATE_SALES_TOTALS = '[Register Sale] Calculate sales totals';
export const CONTINUE_SALE = '[Register Sale] Continue sale';
export const RETURN_SALE = '[Register Sale] Return sale';
export const HOLD_RETURN = '[Register Sale] Hold return';
export const HOLD_RETURN_SUCCESS = '[Register Sale] Hold return success';
export const EXCHANGE_SALE = '[Register Sale] Exchange sale';
export const HOLD_EXCHANGE = '[Register Sale] Hold exchange';
export const HOLD_EXCHANGE_SUCCESS = '[Register Sale] Hold exchange success';
export const ADD_LINE_ITEM_DISCOUNT = '[Register Sale] Add line item discount';
export const REMOVE_LINE_ITEM_DISCOUNT = '[Register Sale] Remove line item discount';
export const ADD_TOTAL_LINE_DISCOUNT = '[Register Sale] Add total line discount';
export const REMOVE_TOTAL_LINE_DISCOUNT = '[Register Sale] Remove total line discount';

export class SelectRegister implements Action {
  readonly type = SELECT_REGISTER;

  constructor(public payload: { register: Register }) {
  }
}

export class CreateSale implements Action {
  readonly type = CREATE_SALE;

  constructor(public payload: {
    storeId: string,
    registerId: string,
    userId: string,
    priceAdjustmentType: PriceAdjustmentType
  }) {
  }
}

export class UpdateSale implements Action {
  readonly type = UPDATE_SALE;

  constructor(public payload: { sale: RegisterSale }) {
  }
}

export class CloseSale implements Action {
  readonly type = CLOSE_SALE;
}

export class CloseSaleSuccess implements Action {
  readonly type = CLOSE_SALE_SUCCESS;
}

export class AddLineItem implements Action {
  readonly type = ADD_LINE_ITEM;

  constructor(public payload: { product: Product, productId: string, variantId?: string, quantity?: number }) {
  }
}

export class AddLineItemSuccess implements Action {
  readonly type = ADD_LINE_ITEM_SUCCESS;
}

export class RemoveLineItem implements Action {
  readonly type = REMOVE_LINE_ITEM;

  constructor(public payload: { id: string }) {
  }
}

export class UpdateLineItemQuantity implements Action {
  readonly type = UPDATE_LINE_ITEM_QUANTITY;

  constructor(public payload: {
    id: string,
    quantity: number
  }) {
  }
}

export class UpdateAddons implements Action {
  readonly type = UPDATE_LINE_ITEM_ADDONS;

  constructor(public payload: { id: string, addons: any[] }) {
  }
}

export class AddPayment implements Action {
  readonly type = ADD_PAYMENT;

  constructor(public payload: { type: PaymentType, amount: number }) {
  }
}

export class RemovePayment implements Action {
  readonly type = REMOVE_PAYMENT;

  constructor(public payload: { id: string }) {
  }
}

export class CalculateSalesTotals implements Action {
  readonly type = CALCULATE_SALES_TOTALS;
}

export class HoldSale implements Action {
  readonly type = HOLD_SALE;
}

export class HoldSaleSuccess implements Action {
  readonly type = HOLD_SALE_SUCCESS;
}

export class VoidSale implements Action {
  readonly type = VOID_SALE;
}

export class AddSaleCustomer implements Action {
  readonly type = ADD_SALE_CUSTOMER;

  constructor(public payload: { customer: Customer }) {
  }
}

export class RemoveSaleCustomer implements Action {
  readonly type = REMOVE_SALE_CUSTOMER;
}

export class ContinueSale implements Action {
  readonly type = CONTINUE_SALE;

  constructor(public payload: { sale: RegisterSale }) {
  }
}

export class ReturnSale implements Action {
  readonly type = RETURN_SALE;

  constructor(public payload: { sale: RegisterSale }) {
  }
}

export class ExchangeSale implements Action {
  readonly type = EXCHANGE_SALE;

  constructor(public payload: { sale: RegisterSale }) {
  }
}

export class HoldReturn implements Action {
  readonly type = HOLD_RETURN;
}

export class HoldReturnSuccess implements Action {
  readonly type = HOLD_RETURN_SUCCESS;
}

export class HoldExchange implements Action {
  readonly type = HOLD_EXCHANGE;
}

export class HoldExchangeSuccess implements Action {
  readonly type = HOLD_EXCHANGE_SUCCESS;
}

export class AddLineItemDiscount implements Action {
  readonly type = ADD_LINE_ITEM_DISCOUNT;

  constructor(public payload: {
    id: string, name: string, method: DiscountMethod,
    calculateMethod: DiscountCalculateMethod, amount?: number, percentage?: number
  }) {
  }
}

export class RemoveLineItemDiscount implements Action {
  readonly type = REMOVE_LINE_ITEM_DISCOUNT;

  constructor(public payload: { id: string }) {
  }
}

export class AddTotalLineDiscount implements Action {
  readonly type = ADD_TOTAL_LINE_DISCOUNT;

  constructor(public payload: { name: string, method: DiscountMethod, amount?: number, percentage?: number }) {
  }
}

export class RemoveTotalLineDiscount implements Action {
  readonly type = REMOVE_TOTAL_LINE_DISCOUNT;
}

export type RegisterSaleActions = SelectRegister | CreateSale | UpdateSale | CloseSale | AddLineItem
  | RemoveLineItem | UpdateLineItemQuantity | UpdateAddons | AddPayment | RemovePayment | CalculateSalesTotals
  | HoldSale | VoidSale | AddSaleCustomer | RemoveSaleCustomer | ContinueSale | ReturnSale | ExchangeSale
  | HoldReturn | HoldReturnSuccess | HoldExchange | HoldExchangeSuccess | AddLineItemDiscount | RemoveLineItemDiscount
  | AddTotalLineDiscount | RemoveTotalLineDiscount;
