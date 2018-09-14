import { Category } from 'pos-models';

import * as actions from '../actions/category.actions';

export type CategoryListState = Category[];
const initialState: CategoryListState = null;

export function categoryListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_CATEGORIES_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_CATEGORY_SUCCESS: {
      return [...state, action.payload];
    }
    case actions.UPDATE_CATEGORY_SUCCESS: {
      return state.map(category => {
        return category.id === action.payload.id ? Object.assign({}, category, action.payload) : category;
      });
    }
    case actions.DELETE_CATEGORY_SUCCESS: {
      return state.filter(category => category.id !== action.payload);
    }
    default:
      return state;
  }
}
