import { RegisterSale } from 'pos-models';

import * as actions from '../actions/sales.actions';

export type SalesListState = RegisterSale[];
const initialState: SalesListState = [];

export function saleListReducer (state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_SALES_SUCCESS: {
      return action.payload;
    }
    default:
      return state;
  }
}
