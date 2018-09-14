import {Employee} from 'pos-models';

import * as actions from '../actions/employee.actions';

export type EmployeeListState = Employee[];
const initialState: EmployeeListState = null;

export function employeeListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_EMPLOYEES_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_EMPLOYEE_SUCCESS: {
      return [...state, action.payload];
    }
    case actions.UPDATE_EMPLOYEE_SUCCESS: {
      return state.map(employee => {
        return employee.id === action.payload.id ? Object.assign({}, employee, action.payload) : employee;
      });
    }
    case actions.DELETE_EMPLOYEE_SUCCESS: {
      return state.filter(employee => employee.id !== action.payload);
    }
    default:
      return state;
  }
}
