import {Register} from 'pos-models';

import * as actions from '../actions/register.actions';

export type RegisterListState = Register[];
const initialState: RegisterListState = null;

export function registerListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_REGISTERS_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_REGISTER_SUCCESS: {
      return [...state, action.payload];
    }
    case actions.UPDATE_REGISTER_SUCCESS: {
      return state.map(employee => {
        return employee.id === action.payload.id ? Object.assign({}, employee, action.payload) : employee;
      });
    }
    case actions.DELETE_REGISTER_SUCCESS: {
      return state.filter(employee => employee.id !== action.payload);
    }
    default:
      return state;
  }
}
