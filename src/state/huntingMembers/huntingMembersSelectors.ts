import {find, map} from 'lodash';
import {createSelector} from 'reselect';
import {
  ExtendedHuntingMemberData,
  getHuntingMember,
  getHuntingMembersByHunting,
  getMe,
} from '../data/dataSelectors';
import {State} from '../types';

export const getMyHuntingMember =
  (huntingId: string) =>
  (state: State): ExtendedHuntingMemberData | undefined => {
    const me: string = getMe(state);
    const members: ExtendedHuntingMemberData[] =
      getHuntingMembersByHunting(huntingId)(state);
    return find(
      members,
      (member: ExtendedHuntingMemberData) => member?.user?.id === me,
    );
  };

export const getHuntingMemberIdByUser = (huntingId: string, userId: string) =>
  createSelector(
    getHuntingMembersByHunting(huntingId),
    (huntingMembers): ExtendedHuntingMemberData | undefined => {
      const member = find(huntingMembers, member => member.user?.id === userId);
      return member;
    },
  );

export const getHuntingMembersLocation =
  ({current, others}: {current: Array<string>; others: Array<string>}) =>
  (state: State): any => {
    const currentHunting = map(current, member =>
      getHuntingMember(member)(state),
    );
    const otherHuntings = map(others, member =>
      getHuntingMember(member)(state),
    );
    return [...currentHunting, ...otherHuntings];
  };
