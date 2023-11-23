import {filter, intersection, map, orderBy} from 'lodash';
import {createSelector} from 'reselect';
import {
  ExtendedLootData,
  getExtendedLootsByHunting,
  getHunting,
  getHuntingMember,
  getHuntingMembersByHunting,
  getLoot,
  getLootsByHuntingArea,
  getLootsByLimitedAnimal,
  getLootsBySeason,
  getMyLoots,
  getUser,
} from '../data/dataSelectors';
import {getOfflineLoots} from '../offline/offlineSelectors';
import {LootData, LootWithUserAndHuntingData, State} from '../types';

export const getLootsByHuntingId = (huntingId: string) =>
  createSelector(
    getExtendedLootsByHunting(huntingId),
    (loots): ExtendedLootData[] => {
      return orderBy(loots, ['createdAt'], ['desc']);
    },
  );

export const getOfflineLootsByHuntingId = (huntingId: string) =>
  createSelector(
    getExtendedLootsByHunting(huntingId),
    getHuntingMembersByHunting(huntingId),
    getOfflineLoots,
    (loots, members, offlineLoots): ExtendedLootData[] => {
      const memberIds = map(members, member => member.id);
      const validOfflineLoots: ExtendedLootData[] = filter(offlineLoots, item =>
        memberIds.includes(item.huntingMember.id),
      );
      return orderBy(
        [...validOfflineLoots, ...loots],
        ['registeredAt'],
        ['desc'],
      );
    },
  );

export const getLootsWithUserAndHuntingData =
  (limitedAnimalId: string, seasonId: string, huntingAreaId: string | null) =>
  (state: State): LootWithUserAndHuntingData[] => {
    const lootIdsByAnimal = getLootsByLimitedAnimal(limitedAnimalId)(state);

    const lootIdsByHuntingArea =
      huntingAreaId !== null
        ? getLootsByHuntingArea(huntingAreaId)(state)
        : getMyLoots(state);

    const lootsIdsBySeason = getLootsBySeason(seasonId)(state);

    const filteredLoots = intersection(
      lootIdsByAnimal,
      lootIdsByHuntingArea,
      lootsIdsBySeason,
    ).map(loot => getLoot(loot)(state));

    return filteredLoots.map((loot: LootData) => {
      const huntingMemberData = getHuntingMember(loot.huntingMember)(state);
      const userData = getUser(huntingMemberData.user)(state);
      const huntingData = getHunting(huntingMemberData.hunting)(state);
      return {
        lootData: loot,
        huntingMemberData,
        userData,
        huntingData,
      };
    });
  };
