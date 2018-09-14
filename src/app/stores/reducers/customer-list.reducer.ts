import { Customer } from 'pos-models';

import * as actions from '../actions/customer.actions';

export type CustomerListState = Customer[];
const initialState: CustomerListState = null;

export function customerListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_CUSTOMERS_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_CUSTOMER_SUCCESS: {
      return [...state, action.payload];
    }
    case actions.UPDATE_CUSTOMER_SUCCESS: {
      return state.map(employee => {
        return employee.id === action.payload.id ? Object.assign({}, employee, action.payload) : employee;
      });
    }
    case actions.DELETE_CUSTOMER_SUCCESS: {
      return state.filter(employee => employee.id !== action.payload);
    }
    default:
      return state;
  }
}
