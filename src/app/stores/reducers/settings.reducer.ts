import { Settings } from 'pos-models';

import * as actions from '../actions/settings.actions';

export type SettingsState = Settings[];
const initialState: SettingsState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.LOAD_SETTINGS_SUCCESS: {
      return action.payload;
    }
    case actions.UPDATE_SETTINGS: {
      return state.map(settings => {
        return settings.id === action.payload.id ? Object.assign({}, settings, action.payload) : settings;
      });
    }
    default:
      return state;
  }
}
