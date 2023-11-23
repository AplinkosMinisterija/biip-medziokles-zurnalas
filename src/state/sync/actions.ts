export const syncConstants = {
  SET_ON_SYNC: 'sync_SET_ON_SYNC',
};

const createSetOnSync =
  (key: string) =>
  (bool: boolean = true) => ({
    type: syncConstants.SET_ON_SYNC,
    payload: {key, bool},
  });

export const syncActions = {
  setOnSync: {
    auth: createSetOnSync('auth'),
    login: createSetOnSync('login'),
    newHunting: createSetOnSync('newHunting'),
    user: createSetOnSync('user'),
    data: createSetOnSync('data'),
    huntings: createSetOnSync('huntings'),
    huntingMember: createSetOnSync('huntingMember'),
    updateStatus: createSetOnSync('updateStatus'),
    loot: createSetOnSync('loot'),
    member: createSetOnSync('member'),
    memberRemove: createSetOnSync('memberRemove'),
    memberUpdate: createSetOnSync('memberUpdate'),
    hunterLocation: createSetOnSync('hunterLocation'),
    localFiles: createSetOnSync('localFiles'),
    limits: createSetOnSync('limits'),
  },
};
