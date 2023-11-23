import {applyPatch} from 'fast-json-patch';
import {Action} from '../types';
import {dataConstants} from './actions';

export const INITIAL_DATA_STATE: any = {};

export const DataReducer = (state = INITIAL_DATA_STATE, action: Action) => {
  switch (action.type) {
    case dataConstants.SET_MAIN_DATA: {
      const updatedState = applyPatch(state, action.payload.patch).newDocument;
      return {
        ...state,
        ...updatedState,
        dadState: action.payload?.dadState,
      };
    }
    case dataConstants.RESET:
      return {...INITIAL_DATA_STATE};
    default:
      return state;
  }
};
