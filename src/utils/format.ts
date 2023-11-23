import {isEmpty} from 'lodash';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
} from '../state/data/dataSelectors';
import {HuntingStatus, UserStatus} from '../state/types';
import {strings} from '../strings';

export const formatPhoneNumber = (phone: string) =>
  typeof phone === 'string'
    ? phone.includes('+370')
      ? '' +
        phone.substring(0, 4) +
        ' ' +
        phone.substring(4, 7) +
        ' ' +
        phone.substring(7, 12)
      : '' +
        phone.substring(0, 4) +
        ' ' +
        phone.substring(4, 6) +
        ' ' +
        phone.substring(6, 12)
    : phone;

export const formatHuntingMembersList = (
  hunters: ExtendedHuntingMemberData[] | undefined,
  hunting: ExtendedHuntingData | undefined,
): {title: string; data: ExtendedHuntingMemberData[]}[] => {
  if (!hunting || !hunters || isEmpty(hunters)) {
    return [];
  }
  const manager: ExtendedHuntingMemberData[] = [];
  const invited: ExtendedHuntingMemberData[] = [];
  const members: ExtendedHuntingMemberData[] = [];
  const guests: ExtendedHuntingMemberData[] = [];
  const left: ExtendedHuntingMemberData[] = [];

  let data = hunters;

  if (
    hunting.status === HuntingStatus.Started ||
    hunting.status === HuntingStatus.Ended
  ) {
    data = hunters.filter(
      (hunter: ExtendedHuntingMemberData) =>
        hunter.status !== UserStatus.Declined,
    );
  }

  data.forEach((member: ExtendedHuntingMemberData) => {
    if (member.leftAt) {
      left.push(member);
    } else if (hunting.manager.user.id === member.user?.id) {
      manager.push({...member, isManager: true});
    } else if (member.isGuest) {
      guests.push(member);
    } else if (
      member.status === UserStatus.Invited &&
      hunting.status !== HuntingStatus.Created
    ) {
      invited.push(member);
    } else members.push(member);
  });

  return [
    {title: strings.manager, data: manager},
    {title: strings.waitingForConfirmation, data: invited},
    {title: strings.members, data: members},
    {title: strings.guests, data: guests},
    {title: strings.left, data: left},
  ].filter(section => !isEmpty(section.data));
};
