import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import ButtonRight from '../../components/ButtonRight';
import Modal from '../../components/Modal';
import {strings} from '../../strings';
import {routes} from '../Router';

const HunterTypeSelection = ({route}: any) => {
  const navigation = useNavigation<any>();

  return (
    <Modal title={strings.invitationTitle.hunting}>
      <Container>
        <ButtonRight
          label={strings.invite.user}
          onPress={() => {
            navigation.replace(routes.inviteUser, {
              huntingId: route.params.huntingId,
            });
          }}
        />

        <ButtonRight
          disabled={route.params.canInviteGuest}
          label={strings.invite.guest}
          onPress={() => {
            navigation.replace(routes.inviteGuest, {
              huntingId: route.params.huntingId,
            });
          }}
        />
      </Container>
    </Modal>
  );
};

const Container = styled(View)`
  padding-top: 0;
  padding-bottom: ${({theme}) => `${theme.footer}px`};
`;

export default HunterTypeSelection;
