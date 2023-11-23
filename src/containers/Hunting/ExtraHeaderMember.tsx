import {useNavigation} from '@react-navigation/native';
import {getHunting} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus, State, UserStatus} from '@root/state/types';
import {getStartedHuntings} from '@state/huntings/huntingsSelectors';
import {some} from 'lodash';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {routes} from '../Router';

interface ExtraHeaderMemberProps {
  huntingId: string;
}

const statusLabels: any = {
  ENDED: strings.huntingStatus.huntingEnded,
  READY: strings.huntingStatus.registrationStarted,
};

const ExtraHeaderMember = ({huntingId}: ExtraHeaderMemberProps) => {
  const navigation = useNavigation<any>();
  const hunting = useSelector(getHunting(huntingId));
  const huntingStatus = hunting.status;
  const myHuntingMember = useSelector(getMyHuntingMember(huntingId));
  const activeHuntings = useSelector(getStartedHuntings());
  const huntingActionOnSync = useSelector(getOnSync.updateStatus);
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const toManyHuntings = activeHuntings.length < 2;
  const huntingInTheSameArea = some(
    activeHuntings,
    h => h.huntingArea.id === hunting.huntingArea,
  );
  const canParticipate =
    !!myHuntingMember &&
    huntingStatus === HuntingStatus.Ready &&
    myHuntingMember?.status === UserStatus.Invited &&
    !(toManyHuntings || huntingInTheSameArea);

  const handelApproveParticipation = () => {
    navigation.navigate(routes.huntingMemberConfirmationPanel, {
      member: myHuntingMember,
      huntingId,
    });
  };

  return (
    <Header>
      <BackButton onPress={() => navigation.goBack()} />
      {canParticipate ? (
        <StyledButton
          variant={Button.Variant.Secondary}
          text={strings.participate}
          onPress={handelApproveParticipation}
          loading={huntingActionOnSync}
          disabled={!isConnected}
        />
      ) : (
        <Text.S variant={Text.Variant.light}>
          {huntingStatus ? statusLabels[huntingStatus] : ''}
        </Text.S>
      )}
    </Header>
  );
};

const Header = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
  padding-bottom: 18px;
  background-color: ${({theme}) => theme.colors.primaryDark};
`;

const StyledButton = styled(Button)`
  width: 60%;
`;

export default ExtraHeaderMember;
