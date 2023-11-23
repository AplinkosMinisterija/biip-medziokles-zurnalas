import {filter} from 'lodash';
import {Action, OfflineState} from '../types';
import {offlineConstants} from './actions';

export const INITIAL_OFFLINE_STATE: OfflineState = {
  offlineData: null,
  offlineLoot: [],
};

export const OfflineReducer = (
  state = INITIAL_OFFLINE_STATE,
  action: Action,
) => {
  switch (action.type) {
    case offlineConstants.SET_OFFLINE_DATA:
      return {
        ...state,
        offlineData: action.payload,
      };
    case offlineConstants.RESET_OFFLINE_DATA:
      return {...INITIAL_OFFLINE_STATE};
    case offlineConstants.ADD_OFFLINE_LOOT:
      return {
        ...state,
        offlineLoot: [action.payload, ...state.offlineLoot],
      };
    case offlineConstants.REMOVE_OFFLINE_LOOT: {
      const updatedOfflineLoots = filter(state.offlineLoot, (loot: any) => {
        if (
          loot.animal !== action.payload.animal &&
          loot.huntingMember !== action.payload.huntingMember &&
          loot.createdAt !== action.payload.createdAt
        ) {
          return loot;
        }
      });

      return {
        ...state,
        offlineLoot: updatedOfflineLoots,
      };
    }

    default:
      return state;
  }
};
