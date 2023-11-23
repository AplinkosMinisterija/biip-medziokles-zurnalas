import {State} from '../types';

const createGetOnSync =
  (key: string) =>
  (state: State): boolean =>
    state.sync[key];

export const getOnSync = {
  auth: createGetOnSync('auth'),
  login: createGetOnSync('login'),
  user: createGetOnSync('user'),
  newHunting: createGetOnSync('newHunting'),
  huntings: createGetOnSync('huntings'),
  data: createGetOnSync('data'),
  huntingMember: createGetOnSync('huntingMember'),
  updateStatus: createGetOnSync('updateStatus'),
  loot: createGetOnSync('loot'),
  member: createGetOnSync('member'),
  memberRemove: createGetOnSync('memberRemove'),
  memberUpdate: createGetOnSync('memberUpdate'),
  hunterLocation: createGetOnSync('hunterLocation'),
  localFiles: createGetOnSync('localFiles'),
  limits: createGetOnSync('limits'),
};
