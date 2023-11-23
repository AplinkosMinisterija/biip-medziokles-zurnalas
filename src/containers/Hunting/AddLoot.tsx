import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {appActions} from '@root/state/app/actions';
import {ExtendedHuntingData} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {isMyHunting} from '@root/state/huntings/huntingsSelectors';
import {getLootsByHuntingId} from '@root/state/loots/lootsSelectors';
import {UserStatus} from '@root/state/types';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import TargetIcon from '../../components/svg/Target';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {theme} from '../../theme';
import {RootStackParamList, routes} from '../Router';

interface AddMemberProps {
  huntingData: ExtendedHuntingData;
  disabled?: boolean;
}

const AddLoot = ({huntingData, disabled = false}: AddMemberProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const loots = useSelector(getLootsByHuntingId(huntingData?.id));

  const lootsTotal = loots?.length
    ? loots.reduce(
        (previousValue, currentValue) => previousValue + currentValue.amount,
        0,
      )
    : 0;

  const myHuntingMember = useSelector(getMyHuntingMember(huntingData?.id));

  const myHunting = useSelector(isMyHunting(huntingData?.id));

  return (
    <Container>
      <Row>
        {myHunting && (
          <Button
            variant={Button.Variant.Primary}
            disabled={disabled}
            onPress={() => {
              if (
                myHuntingMember &&
                !myHuntingMember?.leftAt &&
                myHuntingMember.status === UserStatus.Accepted
              ) {
                navigation.navigate(routes.lootRegistration, {
                  huntingMemberId: myHuntingMember?.id,
                  huntingAreaMPVId: huntingData?.huntingArea.mpvId,
                });
              } else {
                dispatch(
                  appActions.showConfirmationModal({
                    visible: true,
                    title: `Negalima registruoti laimikio`,
                    subtitle: 'Jūs baigėte medžioklę',
                    primaryButton: strings.common.understand,
                    onPrimaryPress: () => {
                      dispatch(appActions.closeConfirmationModal());
                    },
                  }),
                );
              }
            }}
            text={strings.registerLoot}
            width={'90%'}
          />
        )}
        <InfoItem>
          <TargetIcon size={16} color={theme.colors.primaryDark} />
          <Text.M variant={Text.Variant.primaryDark}> {lootsTotal}</Text.M>
        </InfoItem>
      </Row>
    </Container>
  );
};

const Container = styled(View)`
  display: flex;
  padding: 8px 16px;
`;

const InfoItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const Row = styled(View)`
  flex-direction: row;
  min-height: 40px;
`;

export default AddLoot;
