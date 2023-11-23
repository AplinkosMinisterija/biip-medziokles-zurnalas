import {useNavigation, useRoute} from '@react-navigation/native';
import {ExtendedHuntingMemberData} from '@root/state/data/dataSelectors';
import {getHuntingMemberIdByUser} from '@root/state/huntingMembers/huntingMembersSelectors';
import {State} from '@root/state/types';
import {goBack} from '@utils/navigation';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {routes} from '../Router';

const SelectHunterLocation = (): JSX.Element => {
  const router = useRoute<any>();
  const {userId, huntingId} = router.params;
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const navigation = useNavigation<any>();

  const huntingMember: ExtendedHuntingMemberData | undefined = useSelector(
    getHuntingMemberIdByUser(huntingId, userId),
  );

  const huntingMemberId = huntingMember?.id;

  return (
    <Modal title={strings.hunterInvited}>
      <Content>
        <Question>{strings.addHuntingLocation}</Question>
        <PrimaryButton
          variant={Button.Variant.PrimaryDark}
          onPress={() => {
            navigation.goBack();
            navigation.navigate(routes.huntingAreaMap, {
              memberId: huntingMemberId,
              huntingId,
            });
          }}
          text={strings.common.yes}
          disabled={!isConnected}
        />
        <Button
          variant={Button.Variant.PrimaryLight}
          onPress={goBack}
          text={strings.common.no}
        />
      </Content>
    </Modal>
  );
};

const Content = styled(View)`
  padding: ${({theme}) => `16px 16px ${theme.footer}px 16px`};
`;

const PrimaryButton = styled(Button)`
  margin-bottom: 16px;
`;

const Question = styled(Text.M)`
  padding: 0 16px 20px 16px;
  text-align: center;
  line-height: 22px;
`;

export default SelectHunterLocation;
