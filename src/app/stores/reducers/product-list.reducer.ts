import {Product} from 'pos-models';

import * as actions from '../actions/product.actions';

export type ProductListState = Product[];
const initialState: ProductListState = null;

export function productListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_PRODUCTS_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_PRODUCT_SUCCESS: {
      return state ? [...state, action.payload] : [action.payload];
    }
    case actions.UPDATE_PRODUCT_SUCCESS: {
      return state.map(product => {
        return product.id === action.payload.id ? Object.assign({}, product, action.payload) : product;
      });
    }
    case actions.DEACTIVATE_PRODUCT_SUCCESS: {
      return state.filter(product => product.id !== action.payload);
    }
    default:
      return state;
  }
}
