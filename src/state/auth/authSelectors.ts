import {State} from '../types';

export const selectLoginStatus = (state: State) => {
  return state.auth;
};
