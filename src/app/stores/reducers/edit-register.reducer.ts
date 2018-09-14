import { Register } from 'pos-models';

import * as actions from '../actions/edit-register.actions';

export type EditRegisterState = Register;
const initialState: EditRegisterState = null;

export function editRegisterReducer(state = initialState, action: actions.EditRegisterActions) {
  switch (action.type) {
    case actions.LOAD_REGISTER: {
      return action.payload;
    }
    case actions.ADD_QUICK_PRODUCT: {
      const { tabId, position, product, groupQuickProducPosition } = action.payload;
      const tab = state.tabs.find(t => t.id === tabId);
      let quickProductSlot;

      if (groupQuickProducPosition !== undefined) {
        quickProductSlot = tab.quickProducts[groupQuickProducPosition].members[position];
      } else {
        quickProductSlot = tab.quickProducts[position];
      }
      quickProductSlot.label = product.name || product.label;
      return action.payload;
    }
    default:
      return state;
  }
}
