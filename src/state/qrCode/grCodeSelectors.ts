import {compressJSON} from '@root/utils/jsonCompress';
import {groupBy, isEmpty} from 'lodash';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
  ExtendedLootData,
  getExtendedHunting,
  getExtendedHuntingMember,
} from '../data/dataSelectors';
import {getOfflineLootsByHuntingId} from '../loots/lootsSelectors';
import {
  AnimalFormTypes,
  QRCodeDataType,
  QRMinifiedData,
  QRMiniHuntingData,
  QRMiniLootData,
  State,
} from '../types';

export const getQRHuntingData =
  (huntingMemberId: string) =>
  (state: State): string => {
    const huntingMember: ExtendedHuntingMemberData | null =
      getExtendedHuntingMember(huntingMemberId)(state);
    const hunting: ExtendedHuntingData | null = getExtendedHunting(
      huntingMember.hunting,
    )(state);

    if (hunting && huntingMember) {
      const tenant = `${hunting.tenant?.name}, ${hunting.tenant.id}`;
      const huntingArea = hunting.huntingArea.name;
      const huntingManager =
        `${hunting.manager?.user?.firstName} ${hunting.manager?.user?.lastName}` +
        (hunting.manager?.user?.ticketNumber
          ? `, ${hunting.manager.user.ticketNumber}`
          : '');

      const hunter =
        `${huntingMember?.user?.firstName} ${huntingMember?.user.lastName}` +
        (huntingMember?.user?.ticketNumber
          ? `, ${huntingMember.user.ticketNumber}`
          : '');

      const startDate = new Date(hunting.startDate).getTime();
      const endDate = huntingMember.leftAt || hunting.endDate || undefined;
      const huntingLoots: ExtendedLootData[] = getOfflineLootsByHuntingId(
        huntingMember.hunting,
      )(state);

      const lootsByUser = groupBy(huntingLoots, loot => loot.huntingMember.id);
      const userLootData = Object.entries(lootsByUser).map(entry => {
        const loots = entry[1];
        const miniLoots = loots.map(l => {
          const lootData: QRMiniLootData = {
            n: l.animal.name,
            a: l.amount,
            t: new Date(l.registeredAt).getTime(),
          };
          if (l.animal.formType !== AnimalFormTypes.Wolf && l.attributes) {
            if (l.attributes.category) {
              lootData.c = l.attributes.category; // TODO minify category
            }
            if (l.attributes.age) {
              lootData.g = l.attributes.age; // TODO minify age
            }
            if (l.attributes.horns) {
              lootData.h = {
                l: l.attributes.horns.left,
                r: l.attributes.horns.right,
              };
            }
          }
          return lootData;
        });
        const member = loots[0].huntingMember.user;
        return {
          h:
            `${member?.firstName} ${member.lastName}` +
            (member.ticketNumber ? `, ${member.ticketNumber}` : ''),
          d: miniLoots,
        };
      });

      let data: QRMiniHuntingData = {
        t: tenant,
        a: huntingArea,
        m: huntingManager,
        h: hunter,
        s: startDate,
      };
      if (endDate) {
        data.e = new Date(endDate).getTime();
      }
      if (!isEmpty(userLootData)) {
        data.l = userLootData;
      }

      const qrData: QRMinifiedData = {
        d: data,
        m: {
          d: QRCodeDataType.hunting,
          t: new Date().getTime(),
        },
      };
      return compressJSON(qrData);
    }
    return '';
  };
