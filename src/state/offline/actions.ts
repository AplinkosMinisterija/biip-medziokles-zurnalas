export const offlineConstants = {
  SET_OFFLINE_DATA: 'offlineConstants_SET_OFFLINE_DATA',
  RESET_OFFLINE_DATA: 'offlineConstants_RESET_OFFLINE_DATA',
  ADD_OFFLINE_LOOT: 'offline_ADD_OFFLINE_LOOT',
  REMOVE_OFFLINE_LOOT: 'offline_REMOVE_OFFLINE_LOOT',
};

export const offlineActions = {
  setOfflineData: (payload: any) => ({
    type: offlineConstants.SET_OFFLINE_DATA,
    payload,
  }),
  resetOfflineData: () => ({
    type: offlineConstants.RESET_OFFLINE_DATA,
  }),
  addOfflineLoot: (payload: any) => ({
    type: offlineConstants.ADD_OFFLINE_LOOT,
    payload,
  }),
  removeOfflineLoot: (payload: any) => ({
    type: offlineConstants.REMOVE_OFFLINE_LOOT,
    payload,
  }),
};
