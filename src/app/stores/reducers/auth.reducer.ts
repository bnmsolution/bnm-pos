import { Employee } from 'pos-models';

import * as actions from '../actions/auth.actions';

export interface AuthState {
  masterUser: Employee;
  user: Employee;
}

const initialState: AuthState = {
  masterUser: null,
  user: null
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_MASTER_USER: {
      state.masterUser = action.payload.user;
      return state;
    }
    case actions.LOGIN_USER: {
      state.user = action.payload.user;
      return state;
    }
    default:
      return state;
  }
}


