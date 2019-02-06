import {
  RegisterSale,
  RegisterSaleStatus,
  createSale,
  calculateTotals,
  addPayment,
  removePayment,
  RegisterSaleLineItem,
  createLineItem,
  setDiscountRate,
  setRetailPrice,
  setQuantity,
  createReturnSale,
  updateAddons
} from 'pos-models';

import * as actions from '../actions/register-sale.actions';

export type RegisterSaleState = RegisterSale;

const lineItemsReducer = (state: RegisterSaleLineItem[], action) => {
  switch (action.type) {
    case actions.ADD_LINE_ITEM: {
      const { product, productId, variantId, quantity } = action.payload;
      const newLineItem = createLineItem(product, variantId, quantity);
      return [...state, newLineItem];
    }

    case actions.REMOVE_LINE_ITEM: {
      const { id } = action.payload;
      return state.filter(li => li.id !== id);
    }

    case actions.UPDATE_LINE_ITEM: {
      const { id, quantity, retailPrice, discountRate } = action.payload;
      return state.map(lineItem => {
        if (lineItem.id !== id) {
          return lineItem;
        }

        let newLineItem = { ...lineItem };

        // if (lineItem.discountRate !== discountRate) {
        //   newLineItem = setDiscountRate(newLineItem, discountRate);
        // }
        //
        // if (lineItem.retailPrice !== retailPrice) {
        //   newLineItem = setRetailPrice(newLineItem, retailPrice);
        // }


        if (lineItem.quantity !== quantity) {
          newLineItem = setQuantity(newLineItem, quantity);
        }

        return newLineItem;
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
    case actions.UPDATE_LINE_ITEM:
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
      const newState = addPayment(state, type, amount);
      return calculateTotals(newState);
    }

    case actions.REMOVE_PAYMENT: {
      const { id } = action.payload;
      const newState = removePayment(state, id);
      return calculateTotals(newState);
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
      const { sale } = action.payload;
      sale.status = RegisterSaleStatus.Open;
      return sale;
    }

    case actions.RETURN_SALE: {
      const { storeId, registerId, userId, sale } = action.payload;
      return createReturnSale(storeId, registerId, userId, sale);
    }
  }
  return state;
}

