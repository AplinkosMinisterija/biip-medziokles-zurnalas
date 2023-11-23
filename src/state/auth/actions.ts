import {AuthResponse} from '../../apis/api';

export const authConstants = {
  LOGIN: 'authConstants_LOGIN',
  LOGIN_E_VARTAI: 'authConstants_LOGIN_E_VARTAI',
  LOGOUT: 'authConstants_LOGOUT',
  IS_LOGGED_IN: 'authConstants_IS_LOGGED_IN',
  SYNC_FINISH: 'authConstants_SYNC_FINISH',
  SAVE_E_VARTAI_DATA: 'authConstants_SAVE_E_VARTAI_DATA',
  FINISH_E_VARAI_LOGIN: 'authConstants_FINISH_E_VARAI_LOGIN',
  UPDATE_TOKEN: 'authConstants_UPDATE_TOKEN',
};

export const authActions = {
  login: (payload: {username: string; password: string}) => ({
    type: authConstants.LOGIN,
    payload,
  }),
  updateAccessToken: () => ({
    type: authConstants.UPDATE_TOKEN,
  }),
  loginEVartai: () => ({
    type: authConstants.LOGIN_E_VARTAI,
  }),
  logout: () => ({
    type: authConstants.LOGOUT,
  }),
  syncFinish: (loggedIn: boolean) => ({
    type: authConstants.SYNC_FINISH,
    payload: {
      loggedIn,
    },
  }),
  isLoggedIn: () => ({
    type: authConstants.IS_LOGGED_IN,
  }),
  saveEVartaiData: (payload: AuthResponse | null) => ({
    type: authConstants.SAVE_E_VARTAI_DATA,
    payload,
  }),
  finishEVartaiAuth: (payload: string) => ({
    type: authConstants.FINISH_E_VARAI_LOGIN,
    payload,
  }),
};
