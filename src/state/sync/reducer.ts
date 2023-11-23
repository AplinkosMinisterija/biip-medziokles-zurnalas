import update from 'immutability-helper';
import {Action, SyncState} from '../types';
import {syncConstants} from './actions';

export const INITIAL_APP_STATE: SyncState = {
  user: false,
  newHunting: false,
  data: false,
  huntingMember: false,
  loot: false,
  hunterLocation: false,
};

export const SyncReducer = (state = INITIAL_APP_STATE, action: Action) => {
  switch (action.type) {
    case syncConstants.SET_ON_SYNC: {
      const {key, bool} = action.payload;
      const command = {$set: bool};
      return update(state, {[key]: command});
    }
    default:
      return state;
  }
};
