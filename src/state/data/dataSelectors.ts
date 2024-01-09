import {User} from '@sentry/react-native';
import {filter, flatten, map} from 'lodash';
import {getSelectedHuntingArea} from '../app/appSelectors';
import {getLootsByHuntingId} from '../loots/lootsSelectors';
import {
  AnimalData,
  ExtendedLimitedAnimalData,
  HuntingAreaData,
  HuntingData,
  HuntingMemberData,
  LimitedAnimalData,
  LootData,
  PendingLimitRequest,
  Role,
  SeasonData,
  State,
  TenantData,
  TenantUserData,
  TermsOfService,
  UserData,
} from '../types';

// interfaces
export interface ExtendedHuntingMemberData
  extends Omit<HuntingMemberData, 'user' | 'createdBy'> {
  user: UserData;
  createdBy: UserData | null;
  isManager?: boolean;
  isManagerPending?: boolean;
}

export interface ExtendedHuntingAreaData
  extends Omit<HuntingAreaData, 'tenant'> {
  tenant?: TenantData;
}

export interface ExtendedTenantUserData
  extends Omit<TenantUserData, 'huntingAreas' | 'tenant' | 'user'> {
  huntingAreas: ExtendedHuntingAreaData[];
  tenant: TenantData;
  user: UserData;
  role: Role;
}

export interface ExtendedHuntingData
  extends Omit<
    HuntingData,
    'huntingArea' | 'tenant' | 'manager' | 'createdBy'
  > {
  huntingArea: HuntingAreaData;
  tenant: TenantData;
  manager: ExtendedHuntingMemberData;
  createdBy: UserData | null;
  huntingMembers: ExtendedHuntingMemberData[];
  membersCount: number;
  isMyHunting: boolean;
  lootCount: number;
}

export interface ExtendedLootData
  extends Omit<LootData, 'huntingMember' | 'animal' | 'manager' | 'createdBy'> {
  huntingMember: ExtendedHuntingMemberData;
  createdBy: User;
  animal: AnimalData;
  offline?: boolean;
}

// DadState version

export const getDadStateVersion = (state: State): string | null =>
  state.data.dadState;

//Animals

export const getAnimals = (state: State): {[key: string]: AnimalData} =>
  state.data?.animals?.$entities;

export const getAnimal =
  (id: string) =>
  (state: State): AnimalData => {
    return getAnimals(state)?.[id];
  };

export const getAllAnimals = (state: State): Array<string> =>
  state.data?.animals?.all;

//User

export const getMe = (state: State): string => state?.data?.users?.me;

export const getUsers = (
  state: State,
): {
  [key: string]: UserData;
} => {
  return state?.data?.users?.$entities;
};

export const getUser =
  (id: string) =>
  (state: State): UserData => {
    return getUsers(state)?.[id];
  };

export const getMyUser = (state: State): UserData => {
  return getUser(getMe(state))(state);
};

//Tenant

export const getTenants = (
  state: State,
): {
  [key: string]: TenantData;
} => {
  return state?.data?.tenants?.$entities;
};

export const getTenant =
  (id: string) =>
  (state: State): TenantData => {
    return getTenants(state)?.[id];
  };

//HuntingArea

export const getHuntingAreas = (
  state: State,
): {
  [key: string]: HuntingAreaData;
} => {
  return state?.data?.huntingAreas?.$entities;
};

export const getHuntingArea =
  (id: string) =>
  (state: State): HuntingAreaData => {
    return getHuntingAreas(state)?.[id];
  };

//TenantUsers

export const getTenantUsers = (
  state: State,
): {
  [key: string]: TenantUserData;
} => {
  return state?.data?.tenantUsers?.$entities;
};

export const getTenantUser =
  (id: string) =>
  (state: State): TenantUserData => {
    return getTenantUsers(state)?.[id];
  };

//Huntings

export const getHuntings = (
  state: State,
): {
  [key: string]: HuntingData;
} => {
  return state?.data?.huntings?.$entities;
};

export const getHunting =
  (id: string) =>
  (state: State): HuntingData => {
    return getHuntings(state)?.[id];
  };

// Loots

export const getLoots = (
  state: State,
): {
  [key: string]: LootData;
} => {
  return state?.data?.loots?.$entities;
};

export const getLoot =
  (id: string) =>
  (state: State): LootData => {
    return getLoots(state)?.[id];
  };

export const getLootsByHunting =
  (id: string) =>
  (state: State): Array<string> => {
    return state.data.loots?.byHunting?.[id];
  };

export const getLootsByHuntingArea =
  (id: string) =>
  (state: State): Array<string> => {
    return state.data.loots?.byHuntingArea?.[id];
  };

export const getMyLoots = (state: State): Array<string> => {
  return state.data.loots?.my;
};

export const getLootsBySeason =
  (id: string) =>
  (state: State): Array<string> => {
    return state.data.loots?.bySeason?.[id];
  };

export const getLootsByAnimal =
  (id: string) =>
  (state: State): Array<string> => {
    return state.data.loots?.byAnimal?.[id];
  };

export const getLootsByLimitedAnimal =
  (id: string) =>
  (state: State): Array<string> => {
    return state.data.loots?.byLimitedAnimal?.[id];
  };

//HuntingMembers

export const getHuntingMembers = (
  state: State,
): {
  [key: string]: HuntingMemberData;
} => {
  return state?.data?.huntingMembers?.$entities;
};

export const getHuntingMember =
  (id: string) =>
  (state: State): HuntingMemberData => {
    return getHuntingMembers(state)?.[id];
  };

export const getSeasons = (
  state: State,
): {
  [key: string]: SeasonData;
} => {
  return state.data?.seasons?.$entities;
};
export const getSeason =
  (id: string) =>
  (state: State): SeasonData => {
    const seasons = getSeasons(state);
    return seasons[id];
  };
export const getCurrentSeson = (state: State) => {
  return state.data.seasons.currentSeason;
};
export const getCurrentSeasonData = (state: State) => {
  const currentSeasonId = getCurrentSeson(state);
  return getSeasons(state)[currentSeasonId];
};

export const getLimitedAnimals = (
  state: State,
): {
  [key: string]: LimitedAnimalData;
} => {
  return state.data?.limitedAnimals?.$entities;
};

export const getLimitedAnimal =
  (id: string) =>
  (state: State): LimitedAnimalData => {
    const limitedAnimals = getLimitedAnimals(state);
    return limitedAnimals[id];
  };

export const getLimitedAnimalsBySeason =
  (id: string) =>
  (
    state: State,
  ): {
    limited: Array<string>;
    unlimited: Array<string>;
  } => {
    return state.data.limitedAnimals.bySeason[id];
  };

export const getStatsByHuntingArea =
  (id: string) =>
  (
    state: State,
  ): {
    [key: string]: {
      limit?: number;
      loots?: number;
      pending?: number;
    };
  } => {
    return state.data.limitedAnimals.statsByHuntingArea[id];
  };
export const getMyStats = (
  state: State,
): {
  [key: string]: {
    limit?: number;
    loots?: number;
    pending?: number;
  };
} => {
  return state.data.limitedAnimals.myStats;
};

//Complex selectors

export const getExtentedLimitedAnimal =
  (id: string) =>
  (state: State): ExtendedLimitedAnimalData => {
    const limitedAnimal = getLimitedAnimal(id)(state);
    const season: SeasonData = getSeason(limitedAnimal.season)(state);
    const animal = getAnimal(limitedAnimal.animal)(state);
    return {
      ...limitedAnimal,
      season,
      animal,
    };
  };

export const getExtendedLimitedAnimalsBySeason =
  (id: string) =>
  (
    state: State,
  ): {
    limited: ExtendedLimitedAnimalData[];
    unlimited: ExtendedLimitedAnimalData[];
  } => {
    const limitedAnimalsBySeason = getLimitedAnimalsBySeason(id)(state);
    const extendedLimitedAnimals = map(limitedAnimalsBySeason?.limited, la =>
      getExtentedLimitedAnimal(la)(state),
    );
    const extendedUnlimitedAnimals = map(
      limitedAnimalsBySeason?.unlimited,
      la => getExtentedLimitedAnimal(la)(state),
    );
    return {
      limited: extendedLimitedAnimals,
      unlimited: extendedUnlimitedAnimals,
    };
  };

export const getMyTenantUsers = (state: State): ExtendedTenantUserData[] => {
  const my: string[] = state?.data?.tenantUsers?.my || [];
  return my?.map((id: string) => getExtendedTenantUser(id)(state));
};

export const getExtendedTenantUser =
  (id: string) =>
  (state: State): ExtendedTenantUserData => {
    const tenantUser: TenantUserData = getTenantUsers(state)?.[id];
    const tenantUserHuntingAreasIds: string[] = tenantUser.huntingAreas || [];
    const huntingAreas: ExtendedHuntingAreaData[] = map(
      tenantUserHuntingAreasIds,
      (id: string): ExtendedHuntingAreaData =>
        getExtendedHuntingArea(id)(state),
    );
    const tenant: TenantData = getTenant(tenantUser.tenant)(state);
    const user: UserData = getUser(tenantUser.user)(state);
    return {
      ...tenantUser,
      huntingAreas,
      tenant,
      user,
    };
  };

export const checkIfTenantStillAvailable = (state: State) => {
  const selectedHuntingArea: string | null = getSelectedHuntingArea(state);
  const myTenantUser: string[] = state?.data?.tenantUsers?.my || [];
  const availableHuntingAreas = myTenantUser?.map(
    (id: string) => state?.data.tenantUsers?.$entities?.[id]?.huntingAreas,
  );
  const stillExists = flatten(availableHuntingAreas)?.find(
    item => item === selectedHuntingArea,
  );
  return !!stillExists;
};

export const getTenantUsersByHuntingArea =
  (id: string) =>
  (state: State): ExtendedTenantUserData[] => {
    const byHuntingArea: {[key: string]: Array<string>} =
      state.data.tenantUsers.byHuntingArea;
    const tenantUserIds: string[] = byHuntingArea[id];
    return tenantUserIds?.map((tenantUserId: string) => {
      return getExtendedTenantUser(tenantUserId)(state);
    });
  };

export const getTenantUsersByTenant =
  (id: string) =>
  (state: State): ExtendedTenantUserData[] => {
    const all: ExtendedTenantUserData[] = getAllTenantUsers(state);
    return filter(
      all,
      (tenantUser: ExtendedTenantUserData) => tenantUser.tenant.id === id,
    );
  };

export const getAllTenantUsers = (state: State): ExtendedTenantUserData[] => {
  const all = getTenantUsers(state);
  const ids: string[] = Object.keys(all);
  return map(ids, (id: string) => getExtendedTenantUser(id)(state));
};

export const getExtendedHuntingArea =
  (id: string) =>
  (state: State): ExtendedHuntingAreaData => {
    const huntingArea: HuntingAreaData = getHuntingArea?.(id)(state);
    const tenantId: string = huntingArea?.tenant;
    if (tenantId) {
      const tenant: TenantData = getTenant(tenantId)(state);
      return {...huntingArea, tenant};
    } else {
      return {...huntingArea, tenant: undefined};
    }
  };

export const getHuntingAreaByTenant =
  (id: string) =>
  (state: State): ExtendedHuntingAreaData[] => {
    const byTenant: {
      [key: string]: Array<string>;
    } = state?.data?.huntingAreas?.byTenant;
    const huntingAreaIds: string[] = byTenant[id];
    return map(
      huntingAreaIds,
      (id: string) => getExtendedHuntingArea?.(id)?.(state) || null,
    );
  };

export const getExtendedHunting =
  (id: string | undefined) =>
  (state: State): ExtendedHuntingData | null => {
    if (!id) {
      return null;
    }

    const hunting: HuntingData = getHunting(id)(state);
    if (!hunting) {
      return null;
    }

    const huntingAreaId: string = hunting?.huntingArea;
    const tenantId: string = hunting?.tenant;
    const managerId: string = hunting?.manager;
    const createdById: string | null = hunting?.createdBy;

    const huntingArea: HuntingAreaData = getHuntingArea(huntingAreaId)(state);
    const tenant: TenantData = getTenant(tenantId)(state);
    const manager: ExtendedHuntingMemberData =
      getExtendedHuntingMember(managerId)(state);
    const createdBy: UserData | null =
      createdById && getUser(createdById)(state);
    const huntingMembers: ExtendedHuntingMemberData[] =
      getHuntingMembersByHunting(hunting?.id)(state);
    const membersCount = huntingMembers?.length;
    const loots = getLootsByHuntingId(hunting?.id)(state);
    const lootCount = loots?.length
      ? loots.reduce(
          (previousValue, currentValue) => previousValue + currentValue.amount,
          0,
        )
      : 0;
    const me: string = getMe(state);
    const isMyHunting: boolean = !!huntingMembers?.find(
      (member: ExtendedHuntingMemberData) => member?.user?.id === me,
    );
    return {
      ...hunting,
      huntingArea,
      tenant,
      manager,
      createdBy,
      huntingMembers,
      membersCount,
      isMyHunting,
      lootCount,
    };
  };

export const getMyHuntings = (state: State): ExtendedHuntingData[] => {
  const my: string[] = state?.data?.huntings?.my || [];
  const data: ExtendedHuntingData[] = [];
  map(my, (id: string) => {
    const hunting = getExtendedHunting(id)(state);
    if (hunting) {
      data.push(hunting);
    }
  });
  return data;
};

export const getHuntingsByHuntingArea =
  (id: string) =>
  (state: State): ExtendedHuntingData[] => {
    const byHuntingArea: {
      [key: string]: Array<string>;
    } = state?.data?.huntings?.byHuntingArea;
    const huntigIds: string[] = byHuntingArea[id];
    const data: ExtendedHuntingData[] = [];
    map(huntigIds, (id: string) => {
      const hunting = getExtendedHunting(id)(state);
      if (hunting) {
        data.push(hunting);
      }
    });
    return data;
  };

export const getHuntingsByUser =
  (id: string) =>
  (state: State): ExtendedHuntingData[] => {
    const byUser: {
      [key: string]: Array<string>;
    } = state?.data?.huntings?.byUser;
    const huntigIds: string[] = byUser?.[id];
    const data: ExtendedHuntingData[] = [];
    map(huntigIds, (id: string) => {
      const hunting = getExtendedHunting(id)(state);
      if (hunting) {
        data.push(hunting);
      }
    });
    return data;
  };

export const getExtendedHuntingMember =
  (id: string) =>
  (state: State): ExtendedHuntingMemberData => {
    const huntingMember: HuntingMemberData = getHuntingMember(id)(state);
    const userId: string = huntingMember?.user;
    const createdById: string | null = huntingMember?.createdBy;
    const user: UserData = getUser(userId)(state);
    const createdBy: UserData | null = createdById
      ? getUser(createdById)(state)
      : null;
    return {
      ...huntingMember,
      user,
      createdBy,
    };
  };

export const getHuntingMembersByHunting =
  (id: string) =>
  (state: State): ExtendedHuntingMemberData[] => {
    const byHunting: {
      [key: string]: Array<string>;
    } = state.data.huntingMembers.byHunting;
    const huntingMembersIds: string[] = byHunting[id];
    return map(huntingMembersIds, (huntingMemberId: string) =>
      getExtendedHuntingMember(huntingMemberId)(state),
    );
  };

export const getExtendedLoot =
  (item: string) =>
  (state: State): ExtendedLootData => {
    const loot: LootData = getLoot(item)(state);
    const huntingMember: ExtendedHuntingMemberData = getExtendedHuntingMember(
      loot.huntingMember,
    )(state);
    const createdBy: User = getUser(loot.createdBy)(state);
    const animal: AnimalData = getAnimal(loot.animal)(state);
    return {
      ...loot,
      huntingMember,
      createdBy,
      animal,
    };
  };

export const getExtendedLootsByHunting =
  (id: string) =>
  (state: State): ExtendedLootData[] => {
    const lootsByHunting = getLootsByHunting(id)(state);
    return map(
      lootsByHunting,
      (loot: string): ExtendedLootData => getExtendedLoot(loot)(state),
    );
  };

export const getAllExtendedAnimals = (state: State): AnimalData[] => {
  const all: string[] = getAllAnimals(state);
  return map(all, (animal: string) => getAnimal(animal)(state));
};

export const getLimitsByHuntingAreaAnSeason =
  (huntingArea: string, seasonId: string) =>
  (state: State): {[key: string]: number} | undefined => {
    return state.data.limits?.byHuntingArea?.[huntingArea]?.[seasonId];
  };

export const getPendingLimitsByHuntingArea =
  (huntingArea?: string) =>
  (state: State): PendingLimitRequest | null => {
    if (huntingArea) {
      return state.data?.limitsRequests?.pendingByHuntingArea[huntingArea];
    } else {
      return null;
    }
  };

export const getLatestTermsOfService =
  () =>
  (state: State): TermsOfService | null => {
    if (state.data?.termsOfService?.latest) {
      const latest = state.data.termsOfService.latest;
      return state.data.termsOfService.$entities[latest];
    }
    return null;
  };
