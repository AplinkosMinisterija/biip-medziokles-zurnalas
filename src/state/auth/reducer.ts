import {Action, AuthState} from '../types';
import {authConstants} from './actions';

export const INITIAL_AUTH_STATE: AuthState = {
  loggedIn: false,
  eVartaiData: null,
};

export const AuthReducer = (state = INITIAL_AUTH_STATE, action: Action) => {
  switch (action.type) {
    case authConstants.SYNC_FINISH:
      return {
        ...state,
        ...action.payload,
      };
    case authConstants.SAVE_E_VARTAI_DATA:
      return {
        ...state,
        eVartaiData: action.payload,
      };
    default:
      return state;
  }
};
