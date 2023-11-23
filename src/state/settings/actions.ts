import {Role} from '../types';

export const settinConstants = {
  UPDATE_USER: 'settinConstants_UPDATE_USER',
  INVITE_TENANT_USER: 'settinConstants_INVITE_TENANT_USER',
  UPDATE_MEMBER: 'settinConstants_UPDATE_MEMBER',
  REMOVE_MEMBER: 'settinConstants_REMOVE_MEMBER',
};

export const settingsActions = {
  updateUser: (payload: {userId: string; data: any}) => ({
    type: settinConstants.UPDATE_USER,
    payload,
  }),
  inviteTenantUser: (payload: {
    firstName: string;
    lastName: string;
    ticketNumber: string;
    personalCode: string;
    role: Role;
    huntingAreas: string[];
    tenant: string;
  }) => ({
    type: settinConstants.INVITE_TENANT_USER,
    payload,
  }),
  updateMember: (payload: {
    tenantUserId: string;
    data: {role: Role; huntingAreas: string[]};
    permissions: {
      huntingManager: boolean;
      footprintObservation: boolean;
      emergencyContact: boolean;
    };
  }) => ({
    type: settinConstants.UPDATE_MEMBER,
    payload,
  }),
  removeMember: (payload: string) => ({
    type: settinConstants.REMOVE_MEMBER,
    payload,
  }),
};
