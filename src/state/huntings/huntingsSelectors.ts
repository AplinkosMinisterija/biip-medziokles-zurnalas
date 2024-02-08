import {strings} from '@root/strings';
import {compareDesc, isFuture, isToday} from 'date-fns';
import {filter, find, isEmpty, orderBy, some, sortBy, values} from 'lodash';
import {createSelector} from 'reselect';
import {
  getIsMyHuntingEventsFilter,
  getSelectedHuntingArea,
} from '../app/appSelectors';
import {
  ExtendedHuntingData,
  getExtendedHunting,
  getExtendedHuntingMember,
  getHuntingArea,
  getHuntingsByHuntingArea,
  getHuntingsByUser,
  getMe,
  getMyHuntings,
  getTenant,
} from '../data/dataSelectors';
import {getMyHuntingMember} from '../huntingMembers/huntingMembersSelectors';
import {getLootsWithUserAndHuntingData} from '../loots/lootsSelectors';
import {HuntingStatus, HuntingWithLootsData, State, UserStatus} from '../types';

export const getHuntingHistory = (
  state: State,
): {title: string; data: ExtendedHuntingData[]}[] | null => {
  const huntingArea: string | null = getSelectedHuntingArea(state);
  let history: ExtendedHuntingData[] = [];
  if (huntingArea) {
    history = getHuntingsByHuntingArea(huntingArea)(state);
  } else {
    history = getMyHuntings(state);
  }
  const today: ExtendedHuntingData[] = [];
  const upcoming: ExtendedHuntingData[] = [];
  const past: ExtendedHuntingData[] = [];
  const happening: ExtendedHuntingData[] = [];
  const ready: ExtendedHuntingData[] = [];

  history?.forEach((event: ExtendedHuntingData) => {
    if (event) {
      const startDate = new Date(event.startDate);
      if (event.status === HuntingStatus.Started) {
        happening.push(event);
      } else if (event.status === HuntingStatus.Ready) {
        ready.push(event);
      } else {
        if (isToday(startDate)) {
          today.push(event);
        } else if (isFuture(startDate)) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      }
    }
  });

  // sort by start date
  const data = [
    {
      title: strings.registrationStarted,
      data: sortBy(ready, ['startDate']).reverse(),
    },
    {
      title: strings.happening,
      data: sortBy(happening, ['startDate']).reverse(),
    },
    {
      title: strings.today,
      data: sortBy(today, ['startDate']).reverse(),
    },
    {
      title: strings.upcoming,
      data: sortBy(upcoming, ['startDate']).reverse(),
    },
    {
      title: strings.finished,
      data: sortBy(past, ['startDate']).reverse(),
    },
  ].filter(section => !isEmpty(section.data));

  if (isEmpty(data)) {
    return null;
  }
  return data;
};

export const getHuntingHistoryNoSections = (
  state: State,
): ExtendedHuntingData[] => {
  const history = getHuntingHistory(state);
  const showMyHuntingEventsOnly = getIsMyHuntingEventsFilter(state);
  if (history) {
    const data = history.reduce<ExtendedHuntingData[]>(
      (array, item) => [...array, ...item.data],
      [],
    );
    if (showMyHuntingEventsOnly) {
      console.tron.log(data);
      return data.filter(event => event?.isMyHunting);
    }
    return data;
  } else {
    return [];
  }
};

export const getHuntingsByLootData =
  (animalId: string, seasonId: string, huntingAreaId: string | null) =>
  (state: State): HuntingWithLootsData[] => {
    const loots = getLootsWithUserAndHuntingData(
      animalId,
      seasonId,
      huntingAreaId,
    )(state);
    return values(
      loots.reduce((huntings: {[key: string]: HuntingWithLootsData}, loot) => {
        if (!huntings[loot.huntingData.id]) {
          huntings[loot.huntingData.id] = {
            hunting: {
              ...loot.huntingData,
              huntingAreaData: getHuntingArea(loot.huntingData.huntingArea)(
                state,
              ),
              tenantData: getTenant(loot.huntingData.tenant)(state),
              managerData: getExtendedHuntingMember(loot.huntingData.manager)(
                state,
              ),
              lootCount: loot.lootData.amount,
            },
            loots: [loot.lootData],
          };
        } else {
          huntings[loot.huntingData.id].loots.push(loot.lootData);
          huntings[loot.huntingData.id].hunting.lootCount +=
            loot.lootData.amount;
        }
        return huntings;
      }, {}),
    ).sort((a, b) =>
      compareDesc(new Date(a.hunting.startDate), new Date(b.hunting.startDate)),
    );
  };

export const getStartedHuntings =
  (userId?: string) =>
  (state: State): ExtendedHuntingData[] => {
    const me = getMe(state);
    const id = userId || me;
    const allUsersHuntings: ExtendedHuntingData[] =
      getHuntingsByUser(id)(state);
    return filter(allUsersHuntings, (hunting: ExtendedHuntingData) => {
      const myUser = hunting.huntingMembers.find(
        member => member?.user?.id === id,
      );
      return (
        hunting.status === HuntingStatus.Started &&
        !myUser?.leftAt &&
        myUser?.status === UserStatus.Accepted
      );
    });
  };

export const getActiveHuntingsToday =
  (userId?: string) =>
  (state: State): ExtendedHuntingData[] | null => {
    const me = getMe(state);
    const startedHuntings = getStartedHuntings(userId || me)(state);
    if (startedHuntings.length === 0) return null;
    return orderBy(startedHuntings, ['startDate']);
  };

export const getActiveManagedHunting =
  (userId?: string) =>
  (state: State): ExtendedHuntingData | undefined => {
    const me = getMe(state);
    const id = userId || me;
    const startedHuntings = getStartedHuntings(id)(state);
    return find(startedHuntings, hunting => {
      return hunting.manager.user.id === id;
    });
  };

// This is the place, where new hunting restrictions are defined
// user can register to new hunt as participant or start new hunt as manager, but...
export const canParticipateOrManageNewHunt =
  (huntingContext: ExtendedHuntingData | null, userId?: string) =>
  (state: State): boolean => {
    if (!huntingContext) return false;
    const me = getMe(state);
    const id = userId || me;
    const started = getStartedHuntings(id)(state);
    // - You can hunt maximum in two hunts at the same time
    if (started.length >= 2) {
      return false;
    }
    // - Those hunts have to be in different hunting areas
    // extend logic for changing hunting manager
    const huntingInTheSameArea = some(
      started,
      hunting =>
        hunting.huntingArea.id === huntingContext?.huntingArea.id &&
        huntingContext.id !== hunting.id,
    );
    if (huntingInTheSameArea) {
      return false;
    }
    const activeManagedHunt = find(started, hunting => {
      return hunting.manager.user.id === id;
    });
    // - You can be a manager only in one active hunt
    if (activeManagedHunt && huntingContext.manager.user.id === id) {
      return false;
    }
    return true;
  };

// Test if user be a manager when changing during hunt
export const canBecomeManager =
  (userId?: string) =>
  (state: State): boolean => {
    const me = getMe(state);
    const id = userId || me;
    const managedHunt = getActiveManagedHunting(id)(state);
    if (managedHunt) {
      return false;
    }
    return true;
  };
export const isMyHunting = (huntingId: string) =>
  createSelector(
    getMyHuntingMember(huntingId),
    (myHuntingMember): boolean => !!myHuntingMember,
  );

export const amIHuntingAdmin = (huntingId: string) =>
  createSelector(
    getMyHuntingMember(huntingId),
    getExtendedHunting(huntingId),
    (myHuntingMember, huntingData): boolean => {
      return (
        !!myHuntingMember &&
        myHuntingMember.user.id === huntingData?.manager.user.id
      );
    },
  );
