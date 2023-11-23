import {map} from 'lodash';
import {
  ExtendedLootData,
  getAnimal,
  getExtendedHuntingMember,
} from '../data/dataSelectors';
import {State} from '../types';

export const getOfflineLoots = (state: State): ExtendedLootData[] => {
  const actionQueue = state.offline.offlineLoot;
  return map(actionQueue, (item: any) => {
    const animal = getAnimal(item.animal)(state);
    const huntingMember = getExtendedHuntingMember(item.huntingMember)(state);
    return {
      ...item,
      animal,
      huntingMember,
      offline: true,
    };
  });
};
