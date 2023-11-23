import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {
  ExtendedHuntingData,
  getExtendedHunting,
} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {HuntingStatus, State} from '@root/state/types';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import {strings} from '../../strings';
import {RootStackParamList, routes} from '../Router';

type HuntingMoreViewRouteProp = RouteProp<
  RootStackParamList,
  routes.huntingMore
>;

const MoreView = () => {
  const route: HuntingMoreViewRouteProp = useRoute();
  const {huntingId} = route.params;
  const isConnected = useSelector((state: State) => state.network.isConnected);
  const myHuntingMember = useSelector(getMyHuntingMember(huntingId));
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const hunting: ExtendedHuntingData | null = useSelector(
    getExtendedHunting(huntingId),
  );

  const isHuntingAdmin = hunting?.manager.user?.id === myHuntingMember?.user.id;

  const handleEdit = () => {
    if (
      huntingId &&
      hunting?.status !== HuntingStatus.Started &&
      hunting?.status !== HuntingStatus.Ended
    ) {
      navigation.navigate(routes.newHunting, {huntingId});
    }
  };

  const handleDelete = () => {
    navigation.goBack();
    dispatch(
      appActions.showConfirmationModal({
        visible: true,
        title: strings.deleteHunting,
        subtitle: strings.confirmHuntingDelete,
        primaryButton: strings.common.delete,
        secondaryButton: strings.common.cancel,
        onPrimaryPress: () => {
          if (huntingId && hunting?.status === HuntingStatus.Created) {
            dispatch(huntingActions.deleteHunting({huntingId}));
            navigation.goBack();
          }
          dispatch(appActions.closeConfirmationModal());
        },
      }),
    );
  };

  const handleQRCode = () => {
    if (myHuntingMember) {
      navigation.goBack();
      navigation.navigate(routes.qrCodeDisplay, {
        huntingMemberId: myHuntingMember.id,
      });
    }
  };

  const crudVisible = isHuntingAdmin;

  const qrCodeEnabled =
    hunting?.status === HuntingStatus.Started ||
    hunting?.status === HuntingStatus.Ended;

  return (
    hunting && (
      <Modal>
        <Container>
          {qrCodeEnabled && (
            <StyledButton
              text={'QR KODAS'}
              onPress={handleQRCode}
              variant={Button.Variant.PrimaryDark}
            />
          )}
          {crudVisible && (
            <>
              <StyledButton
                text={strings.editHunting}
                onPress={handleEdit}
                disabled={
                  hunting?.status !== HuntingStatus.Created || !isConnected
                }
              />
              <StyledButton
                text={strings.deleteHunting}
                onPress={handleDelete}
                variant={Button.Variant.Danger}
                disabled={
                  hunting.status !== HuntingStatus.Created || !isConnected
                }
              />
            </>
          )}
        </Container>
      </Modal>
    )
  );
};

const Container = styled(View)`
  padding-top: 0;
  padding: 0 16px;
  padding-bottom: ${({theme}) => `${theme.footer}px`};
`;

const StyledButton = styled(Button)`
  padding: 8px 0;
`;

export default MoreView;
