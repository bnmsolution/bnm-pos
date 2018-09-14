import { PosStore } from 'pos-models';

import * as actions from '../actions/store.actions';

export type StoresState = PosStore[];
const initialState: StoresState = null;

export function storeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_STORE_SUCCESS: {
      return action.payload;
    }
    case actions.UPDATE_STORE: {
      return state.map(settings => {
        return settings.id === action.payload.id ? Object.assign({}, settings, action.payload) : settings;
      });
    }
    default:
      return state;
  }
}
