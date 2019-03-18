import {
  RegisterSale,
  RegisterSaleStatus,
  createSale,
  calculateTotals,
  addPayment,
  removePayment,
  RegisterSaleLineItem,
  createLineItem,
  setQuantity,
  createReturnSale,
  updateAddons,
  Discount,
  DiscountType,
  addDiscount,
  removeDiscount,
  addTotalLineDiscount,
  removeTotalLineDiscount
} from 'pos-models';

import * as actions from '../actions/register-sale.actions';
import { cloneDeep } from 'src/app/shared/utils/lang';

export type RegisterSaleState = RegisterSale;

const lineItemsReducer = (state: RegisterSaleLineItem[], action) => {
  switch (action.type) {
    case actions.ADD_LINE_ITEM: {
      const { product, variantId, quantity } = action.payload;
      const newLineItem = createLineItem(product, variantId, quantity);
      return [...state, newLineItem];
    }

    case actions.REMOVE_LINE_ITEM: {
      const { id } = action.payload;
      return state.filter(li => li.id !== id);
    }

    case actions.UPDATE_LINE_ITEM_QUANTITY: {
      const { id, quantity } = action.payload;
      return state.map(lineItem => {
        if (lineItem.id !== id) {
          return lineItem;
        }

        if (lineItem.quantity !== quantity) {
          return setQuantity(lineItem, quantity);
        }

        return lineItem;
      });
    }

    case actions.UPDATE_LINE_ITEM_ADDONS: {
      const { id, addons } = action.payload;
      return state.map(lineItem => {
        if (lineItem.id !== id) {
          return lineItem;
        }
        return updateAddons(lineItem, addons);
      });
    }

    case actions.ADD_LINE_ITEM_DISCOUNT: {
      const { id, name, method, calculateMethod, amount, percentage } = action.payload;
      const discount: Discount = {
        type: DiscountType.LineItemDiscount,
        name,
        method,
        calculateMethod,
        amount,
        percentage
      };

      return state.map(lineItem => {
        if (lineItem.id !== id) {
          return lineItem;
        }
        return addDiscount(lineItem, discount);
      });
    }

    case actions.REMOVE_LINE_ITEM_DISCOUNT: {
      return state.map(lineItem => {
        if (lineItem.id !== action.payload.id) {
          return lineItem;
        }
        return removeDiscount(lineItem);
      });
    }
  }
};

export function registerSaleReducer(state: RegisterSaleState = null, action) {
  switch (action.type) {
    case actions.CREATE_SALE: {
      const { storeId, registerId, userId, priceAdjustmentType } = action.payload;
      if (state === null) {
        return createSale(storeId, registerId, userId, priceAdjustmentType);
      } else {
        throw Error('Cannot create sale. Please close the current sale first.');
      }
    }
    case actions.ADD_LINE_ITEM_DISCOUNT:
    case actions.REMOVE_LINE_ITEM_DISCOUNT:
    case actions.UPDATE_LINE_ITEM_QUANTITY:
    case actions.UPDATE_LINE_ITEM_ADDONS:
    case actions.REMOVE_LINE_ITEM:
    case actions.ADD_LINE_ITEM: {
      const lineItems = lineItemsReducer(state.lineItems, action);
      return calculateTotals({ ...state, lineItems });
    }

    case actions.CLOSE_SALE_SUCCESS: {
      return null;
    }

    case actions.HOLD_SALE_SUCCESS: {
      return null;
    }

    case actions.ADD_PAYMENT: {
      const { type, amount } = action.payload;
      return addPayment(state, type, amount);
    }

    case actions.REMOVE_PAYMENT: {
      const { id } = action.payload;
      return removePayment(state, id);
    }

    case actions.CLOSE_SALE: {
      let newStatus;
      switch (state.status) {
        case RegisterSaleStatus.Return: {
          newStatus = RegisterSaleStatus.ReturnCompleted;
          break;
        }
        case RegisterSaleStatus.Exchange: {
          newStatus = RegisterSaleStatus.ExchangeCompleted;
          break;
        }
        default: {
          newStatus = RegisterSaleStatus.Completed;
        }
      }
      return { ...state, status: newStatus };
    }

    case actions.HOLD_SALE: {
      let newStatus;
      switch (state.status) {
        case RegisterSaleStatus.Return: {
          newStatus = RegisterSaleStatus.ReturnHold;
          break;
        }
        case RegisterSaleStatus.Exchange: {
          newStatus = RegisterSaleStatus.ExchangeHold;
          break;
        }
        default: {
          newStatus = RegisterSaleStatus.Hold;
        }
      }
      return { ...state, status: newStatus };
    }

    case actions.VOID_SALE: {
      return null;
    }

    case actions.ADD_SALE_CUSTOMER: {
      const { customer } = action.payload;
      return {
        ...state,
        customerId: customer.id,
        customer: customer
      };
    }

    case actions.REMOVE_SALE_CUSTOMER: {
      return {
        ...state,
        customerId: null,
        customer: null
      };
    }

    case actions.CONTINUE_SALE: {
      const saleForReturn = cloneDeep(action.payload.sale);
      saleForReturn.status = RegisterSaleStatus.Open;
      return saleForReturn;
    }

    case actions.RETURN_SALE: {
      const { storeId, registerId, userId, sale } = action.payload;
      return createReturnSale(storeId, registerId, userId, sale);
    }

    case actions.ADD_TOTAL_LINE_DISCOUNT: {
      const { name, method, calculateMethod, amount, percentage } = action.payload;
      const discount: Discount = {
        type: DiscountType.TotalDiscount,
        name,
        method,
        calculateMethod,
        amount,
        percentage
      };

      return addTotalLineDiscount(state, discount);
    }

    case actions.REMOVE_TOTAL_LINE_DISCOUNT: {
      return removeTotalLineDiscount(state);
    }
  }
  return state;
}

