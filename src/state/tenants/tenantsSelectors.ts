import {
  ExtendedTenantUserData,
  getAllTenantUsers,
  getTenantUsersByTenant,
} from '../data/dataSelectors';
import {Role, State, UserData} from '../types';

export const getTenantOwner =
  (tenantId: string) =>
  (state: State): ExtendedTenantUserData[] => {
    const tenantUsers: ExtendedTenantUserData[] =
      getTenantUsersByTenant(tenantId)(state);
    const ownerTenantUsers = tenantUsers?.filter(
      (tu: ExtendedTenantUserData) => tu?.role === Role.owner,
    );
    return ownerTenantUsers;
  };

export const getTenantAdmins =
  (tenantId: string) =>
  (state: State): ExtendedTenantUserData[] => {
    const tenantUsers: ExtendedTenantUserData[] =
      getTenantUsersByTenant(tenantId)(state);
    const adminTenantUsers = tenantUsers?.filter(
      (tu: ExtendedTenantUserData) => tu?.role === Role.userAdmin,
    );
    return adminTenantUsers;
  };

export const getTenantUsers =
  (tenantId: string) =>
  (state: State): UserData[] => {
    return getTenantUsersByTenant(tenantId)(state)?.map(
      (t: ExtendedTenantUserData) => t.user,
    );
  };

export const getTenantUserByUserId =
  (userId: string) =>
  (state: State): ExtendedTenantUserData | undefined => {
    const all = getAllTenantUsers(state);
    return all.find(tenantUser => tenantUser?.user?.id === userId);
  };
