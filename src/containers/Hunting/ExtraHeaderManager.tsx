import {useNavigation} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {
  ExtendedHuntingMemberData,
  getExtendedHunting,
  getMe,
} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus, State, UserStatus} from '@root/state/types';
import {canParticipateOrManageNewHunt} from '@state/huntings/huntingsSelectors';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {routes} from '../Router';

interface ExtraHeaderManagerProps {
  huntingId: string;
}

const ExtraHeaderManager = ({huntingId}: ExtraHeaderManagerProps) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const huntingActionOnSync = useSelector(getOnSync.updateStatus);
  const huntingData = useSelector(getExtendedHunting(huntingId));
  const me = useSelector(getMe);
  const allMembersResponded = huntingData
    ? !huntingData.huntingMembers.find(
        (member: ExtendedHuntingMemberData) =>
          member.status === UserStatus.Invited && member.user?.id !== me,
      )
    : false;

  const iCanStartRegistration = useSelector(
    canParticipateOrManageNewHunt(huntingData),
  );

  const huntingButtonConfig: any = {
    CREATED: {
      label: strings.startRegistration,
      onPress: () => {
        if (huntingId) {
          if (iCanStartRegistration) {
            dispatch(
              huntingActions.updateHuntingStatus({
                id: huntingId,
                status: HuntingStatus.Ready,
              }),
            );
          } else {
            navigation.navigate(routes.huntingDialog, {
              title: strings.errors.huntingInProgress.title,
              message: strings.errors.huntingInProgress.subtitle,
            });
          }
        }
      },
    },
    READY: {
      label: strings.startHunting,
      onPress: () => {
        if (huntingId) {
          if (allMembersResponded) {
            dispatch(
              huntingActions.updateHuntingStatus({
                id: huntingId,
                status: HuntingStatus.Started,
              }),
            );
          } else {
            dispatch(
              appActions.showConfirmationModal({
                visible: true,
                title: strings.errors.notAllMembersResponded.title,
                subtitle: strings.errors.notAllMembersResponded.subtitle,
                primaryButton: 'Pradėti medžioklę',
                secondaryButton: 'Atšaukti',
                onPrimaryPress: () => {
                  dispatch(
                    huntingActions.updateHuntingStatus({
                      id: huntingId,
                      status: HuntingStatus.Started,
                    }),
                  );
                },
              }),
            );
          }
        }
      },
    },
    STARTED: {
      label: strings.endHunting,
      onPress: () =>
        huntingId &&
        dispatch(
          appActions.showConfirmationModal({
            visible: true,
            title: strings.confirmHuntingEnd,
            subtitle: strings.confirmHuntingEndSubtitle,
            primaryButton: strings.endHunting,
            secondaryButton: strings.common.cancel,
            onPrimaryPress: () => {
              dispatch(
                huntingActions.updateHuntingStatus({
                  id: huntingId,
                  status: HuntingStatus.Ended,
                }),
              );
              dispatch(appActions.closeConfirmationModal());
            },
          }),
        ),
    },
  };

  const isConnected = useSelector((state: State) => state.network.isConnected);

  const Action = huntingData?.status
    ? huntingButtonConfig[huntingData?.status]
    : {label: '', onPress: () => {}};

  return (
    <Header>
      <BackButton onPress={() => navigation.goBack()} />
      <>
        {!!huntingData?.status && !!huntingButtonConfig[huntingData?.status] ? (
          <StartButton
            variant={Button.Variant.Secondary}
            text={Action.label}
            onPress={Action.onPress}
            loading={huntingActionOnSync}
            disabled={!isConnected}
          />
        ) : (
          huntingData?.status === HuntingStatus.Ended && (
            <Text.S variant={Text.Variant.light}>
              {strings.huntingStatus.huntingEnded}
            </Text.S>
          )
        )}
      </>
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

const StartButton = styled(Button)`
  width: 60%;
`;

export default ExtraHeaderManager;
