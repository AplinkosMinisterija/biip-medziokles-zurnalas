import {getSelectedHuntingArea} from '@state/app/appSelectors';
import {filter, find, some} from 'lodash';
import {createSelector} from 'reselect';
import {
  ExtendedTenantUserData,
  getAllTenantUsers,
  getHunting,
  getMyTenantUsers,
} from '../data/dataSelectors';
import {HuntingData, Role, State} from '../types';

export const getMyTenantUser = createSelector(
  getMyTenantUsers,
  getSelectedHuntingArea,
  (myTenantUser, selectedHuntingArea): ExtendedTenantUserData | undefined => {
    return find(myTenantUser, tenantUser =>
      some(
        tenantUser.huntingAreas,
        huntingArea => huntingArea.id === selectedHuntingArea,
      ),
    );
  },
);

export const getTenantUsersByTenant =
  (id: string) =>
  (state: State): ExtendedTenantUserData[] => {
    const all: ExtendedTenantUserData[] = getAllTenantUsers(state);
    return filter(
      all,
      (tenantUser: ExtendedTenantUserData) => tenantUser.tenant.id === id,
    );
  };

export const getTenantUser = (userId: string, tenantId: string) =>
  createSelector(
    getTenantUsersByTenant(tenantId),
    (tenantUsers: ExtendedTenantUserData[]) => {
      return find(tenantUsers, tu => tu?.user?.id === userId);
    },
  );

export const shouldAskLimitChange = (userId: string, tenantId: string) =>
  createSelector(getTenantUsersByTenant(tenantId), (tenantUsers): boolean => {
    const tenantUserByUser = find(tenantUsers, tu => tu?.user?.id === userId);
    const role = tenantUserByUser?.role;
    return role === Role.owner || role === Role.userAdmin;
  });

export const amITenantAdminOrOwner = (tenantId?: string) => (state: State) => {
  if (!tenantId) {
    return false;
  }
  const myTenantUsers: ExtendedTenantUserData[] = getMyTenantUsers(state);
  const myTenantUser = find(myTenantUsers, tu => tu?.tenant?.id === tenantId);
  return (
    myTenantUser?.role === Role.userAdmin || myTenantUser?.role === Role.owner
  );
};

export const amITenantOwner = (tenantId?: string) => (state: State) => {
  if (!tenantId) {
    return false;
  }
  const myTenantUsers: ExtendedTenantUserData[] = getMyTenantUsers(state);
  const myTenantUser = find(myTenantUsers, tu => tu?.tenant?.id === tenantId);
  return myTenantUser?.role === Role.owner;
};

export const amITenantAdminByHunting =
  (huntingId: string) =>
  (state: State): boolean => {
    const myTenantUsers: ExtendedTenantUserData[] = getMyTenantUsers(state);
    const hunting: HuntingData = getHunting(huntingId)(state);
    if (!hunting) return false;
    const huntingTenantUser = find(
      myTenantUsers,
      tu => tu?.tenant?.id === hunting?.tenant,
    );
    if (!huntingTenantUser) return false;
    return [Role.owner, Role.userAdmin].some(
      role => role === huntingTenantUser.role,
    );
  };

export const getMyTenantUserByTenant = (tenantId: string) =>
  createSelector(
    getMyTenantUsers,
    (tenantUsers): ExtendedTenantUserData | undefined => {
      return find(tenantUsers, tu => tu?.tenant?.id === tenantId);
    },
  );
