import {Vendor} from 'pos-models';

import * as actions from '../actions/vendor.actions';

export type VendorListState = Vendor[];
const initialState: VendorListState = null;

export function vendorListReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_VENDORS_SUCCESS: {
      return action.payload;
    }
    case actions.ADD_VENDOR_SUCCESS: {
      return [...state, action.payload];
    }
    case actions.UPDATE_VENDOR_SUCCESS: {
      return state.map(vendor => {
        return vendor.id === action.payload.id ? Object.assign({}, vendor, action.payload) : vendor;
      });
    }
    case actions.DELETE_VENDOR_SUCCESS: {
      return state.filter(vendor => vendor.id !== action.payload);
    }
    case 'vendorTest': {
      break;
    }
    default:
      return state;
  }
}
