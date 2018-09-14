import {Tax} from 'pos-models';

import * as actions from '../actions/tax.actions';

export type TaxListState = Tax[];
const initialState: TaxListState = null;

export function taxListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_TAXES_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_TAX_SUCCESS: {
      return [...state, Object.assign({}, action.payload)];
    }
    case actions.UPDATE_TAX_SUCCESS: {
      return state.map(tax => {
        return tax.id === action.payload.id ? Object.assign({}, tax, action.payload) : tax;
      });
    }
    case actions.DELETE_TAX_SUCCESS: {
      return state.filter(tax => tax.id !== action.payload);
    }
    default:
      return state;
  }
}
