export const dataConstants = {
  AGREE_TO_TERMS_OF_SERVICE: 'data_AGREE_TO_TERMS_OF_SERVICE',
  GET_MAIN_DATA: 'data_GET_MAIN_DATA',
  SET_MAIN_DATA: 'data_SET_MAIN_DATA',
  RESET: 'data_RESET',
};

export const dataActions = {
  getMainData: (options = {}) => ({
    type: dataConstants.GET_MAIN_DATA,
    options,
  }),
  setMainData: (payload: any) => ({
    type: dataConstants.SET_MAIN_DATA,
    payload,
  }),
  agreeToTermsOfService: (payload: number | string) => ({
    type: dataConstants.AGREE_TO_TERMS_OF_SERVICE,
    payload,
  }),
  reset: () => ({
    type: dataConstants.RESET,
  }),
};
