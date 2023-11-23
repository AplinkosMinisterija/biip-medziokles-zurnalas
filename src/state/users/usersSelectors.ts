import {compareDesc} from 'date-fns';
import {differenceBy, values} from 'lodash';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
  ExtendedTenantUserData,
  getExtendedHunting,
  getExtendedHuntingMember,
  getHuntingArea,
  getHuntingMembersByHunting,
  getTenant,
  getTenantUsersByHuntingArea,
} from '../data/dataSelectors';
import {getLootsWithUserAndHuntingData} from '../loots/lootsSelectors';
import {State, UserData, UserWithLootsAndHuntingData} from '../types';

export const getNotInvitedHuntingAreaUsers =
  (huntingId: string) =>
  (state: State): UserData[] | undefined => {
    const hunting: ExtendedHuntingData | null =
      getExtendedHunting(huntingId)(state);
    if (hunting) {
      const huntingAreaId: string = hunting.huntingArea?.id;
      const huntingUsers: UserData[] = getHuntingMembersByHunting(huntingId)(
        state,
      )?.map((member: ExtendedHuntingMemberData) => member.user);
      const huntingAreaUsers: UserData[] = getTenantUsersByHuntingArea(
        huntingAreaId,
      )(state)?.map((member: ExtendedTenantUserData) => member.user);
      const data: UserData[] = differenceBy(
        huntingAreaUsers,
        huntingUsers,
        (user: UserData) => user?.id,
      );
      //TODO: filter user who not have the right to hunt in that huntingArea
      return data?.filter(user => user?.id);
    }
  };

export const getUsersByLimitedAnimal =
  (limitedAnimalId: string, seasonId: string, huntingAreaId: string | null) =>
  (state: State): UserWithLootsAndHuntingData[] => {
    const loots = getLootsWithUserAndHuntingData(
      limitedAnimalId,
      seasonId,
      huntingAreaId,
    )(state);
    return values(
      loots.reduce(
        (users: {[key: string]: UserWithLootsAndHuntingData}, loot) => {
          if (!users[loot.userData.id]) {
            users[loot.userData.id] = {
              userData: loot.userData,
              loots: [loot.lootData],
              lootCount: loot.lootData.amount,
              huntings: [
                {
                  ...loot.huntingData,
                  huntingAreaData: getHuntingArea(loot.huntingData.huntingArea)(
                    state,
                  ),
                  tenantData: getTenant(loot.huntingData.tenant)(state),
                  managerData: getExtendedHuntingMember(
                    loot.huntingData.manager,
                  )(state),
                  lootCount: loot.lootData.amount,
                },
              ],
            };
          } else {
            users[loot.userData.id].loots.push(loot.lootData);
            users[loot.userData.id].lootCount += loot.lootData.amount;
            // check if not duplicate
            const huntingIndex = users[loot.userData.id].huntings.findIndex(
              hunt => hunt.id === loot.huntingData.id,
            );
            if (huntingIndex === -1) {
              // if not duplicate
              users[loot.userData.id].huntings.push({
                ...loot.huntingData,
                huntingAreaData: getHuntingArea(loot.huntingData.huntingArea)(
                  state,
                ),
                tenantData: getTenant(loot.huntingData.tenant)(state),
                managerData: getExtendedHuntingMember(loot.huntingData.manager)(
                  state,
                ),
                lootCount: loot.lootData.amount,
              });
            } else {
              // when duplicate just increment loot count
              users[loot.userData.id].huntings[huntingIndex].lootCount +=
                loot.lootData.amount;
            }
          }
          return users;
        },
        {},
      ),
    ).map(user => ({
      ...user,
      huntings: user.huntings.sort((a, b) =>
        compareDesc(new Date(a.startDate), new Date(b.startDate)),
      ),
    }));
  };
