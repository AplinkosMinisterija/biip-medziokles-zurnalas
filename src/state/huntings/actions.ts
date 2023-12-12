import {
  GuestInvitation,
  HuntingStatus,
  LootRegistrationData,
  LootUpdateData,
} from '../types';

export const huntingConstants = {
  CREATE_HUNTING: 'hunting_CREATE_HUNTING',
  INVITE_HUNTING_MEMBER: 'hunting_INVITE_HUNTING_MEMBER',
  UPDATE_HUNTING_STATUS: 'hunting_UPDATE_HUNTING_STATUS',
  INVITE_HUNTING_MEMBER_WITH_SIGNATURE:
    'hunting_INVITE_HUNTING_MEMBER_WITH_SIGNATURE',
  CHANGE_HUNTING_MANAGER: 'hunting_CHANGE_HUNTING_MANAGER',
  REMOVE_HUNTING_MEMBER: 'hunting_REMOVE_HUNTING_MEMBER',
  REGISTER_LOOT: 'hunting_REGISTER_LOOT',
  UPDATE_HUNTING_MEMBER: 'hunting_UPDATE_HUNTING_MEMBER',
  UPDATE_LOOT: 'hunting_UPDATE_LOOT',
  DELETE_HUNTING: 'hunting_DELETE_HUNTING',
  UPDATE_HUNTER_LOCATION: 'hunting_UPDATE_HUNTER_LOCATION',
  ACCEPT_HUNTING_MEMBER: 'hunting_ACCEPT_HUNTING_MEMBER',
  ACCEPT_HUNTING_MANAGER_CHANGE: 'hunting_ACCEPT_HUNTING_MANAGER_CHANGE',
  DECLINE_HUNTING_MANAGER_CHANGE: 'hunting_DECLINE_HUNTING_MANAGER_CHANGE',
};

export const huntingActions = {
  createHunting: ({
    huntingData,
    isEditing,
  }: {
    huntingData: any;
    isEditing?: boolean;
  }) => ({
    type: huntingConstants.CREATE_HUNTING,
    payload: {huntingData},
    options: {isEditing},
  }),
  inviteHuntingMember: (
    payload: {huntingId: string; user: string | GuestInvitation},
    options = {},
  ) => ({
    type: huntingConstants.INVITE_HUNTING_MEMBER,
    payload,
    options,
  }),
  inviteHuntingMemberWithSignature: (
    payload: {
      huntingId: string;
      user: string | GuestInvitation;
      signature: string;
    },
    options = {},
  ) => ({
    type: huntingConstants.INVITE_HUNTING_MEMBER_WITH_SIGNATURE,
    payload,
    options,
  }),
  updateHuntingStatus: (payload: {id: string; status: HuntingStatus}) => ({
    type: huntingConstants.UPDATE_HUNTING_STATUS,
    payload,
  }),
  changeHuntingManager: (payload: {
    huntingId: string;
    managerId: string;
    signature?: string;
  }) => ({
    type: huntingConstants.CHANGE_HUNTING_MANAGER,
    payload,
  }),
  acceptHuntingManagerChange: (
    payload: {
      huntingId: string;
      signature?: string;
    },
    options = {},
  ) => ({
    type: huntingConstants.ACCEPT_HUNTING_MANAGER_CHANGE,
    payload,
    options,
  }),
  declineHuntingManagerChange: (
    payload: {huntingId: string},
    options = {},
  ) => ({
    type: huntingConstants.DECLINE_HUNTING_MANAGER_CHANGE,
    payload,
    options,
  }),
  removeHuntingMember: (payload: {memberId: string}) => ({
    type: huntingConstants.REMOVE_HUNTING_MEMBER,
    payload,
  }),
  registerLoot: (payload: LootRegistrationData, options: {}) => ({
    type: huntingConstants.REGISTER_LOOT,
    payload,
    options,
    meta: {
      retry: true,
    },
  }),
  updateLoot: (payload: LootUpdateData) => ({
    type: huntingConstants.UPDATE_LOOT,
    payload,
  }),
  updateHuntingMember: (
    payload: {memberId: string; data: any},
    options = {},
  ) => ({
    type: huntingConstants.UPDATE_HUNTING_MEMBER,
    payload,
    options,
  }),
  acceptHuntingMember: (
    payload: {memberId: string; signature?: string},
    options = {},
  ) => ({
    type: huntingConstants.ACCEPT_HUNTING_MEMBER,
    payload,
    options,
  }),
  updateHunterLocation: (
    payload: {memberId: string | number; geom: unknown},
    options: {},
  ) => ({
    type: huntingConstants.UPDATE_HUNTER_LOCATION,
    payload,
    options,
  }),
  deleteHunting: (payload: {huntingId: string}) => ({
    type: huntingConstants.DELETE_HUNTING,
    payload,
  }),
};
