import {RootStackParamList, routes} from '@containers/Router';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import HuntingUserCard from '@root/components/HuntingUserCard';
import {
  ExtendedHuntingData,
  ExtendedHuntingMemberData,
  getExtendedLootsByHunting,
} from '@root/state/data/dataSelectors';
import {filter} from 'lodash';
import React from 'react';
import {useSelector} from 'react-redux';

interface HuntingMemberCardProps {
  member: ExtendedHuntingMemberData;
  myMember: ExtendedHuntingMemberData;
  hunting: ExtendedHuntingData;
  enableEdit: boolean;
  isLast?: boolean;
  showStatus?: boolean;
}

const HuntingMemberCard: React.FC<HuntingMemberCardProps> = ({
  member,
  myMember,
  isLast,
  hunting,
  showStatus,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {user, isManager, createdBy, status, leftAt} = member;

  const loots = useSelector(getExtendedLootsByHunting(hunting.id));

  const memberLoots = filter(loots, l => l.huntingMember.id === member.id);

  const lootsTotal = memberLoots?.length
    ? memberLoots.reduce(
        (previousValue, currentValue) => previousValue + currentValue.amount,
        0,
      )
    : 0;

  return user ? (
    <HuntingUserCard
      isLast={isLast}
      activeOpacity={isManager ? 1 : 0.6}
      onPress={() =>
        navigation.navigate(routes.huntingMemberPanel, {
          member,
          huntingData: hunting,
          myMember: myMember,
        })
      }
      user={user}
      leftHunting={!!leftAt}
      isManager={isManager}
      createdBy={createdBy}
      status={showStatus && !isManager ? status : null}
      lootsCount={lootsTotal}
    />
  ) : null;
};

export default HuntingMemberCard;
