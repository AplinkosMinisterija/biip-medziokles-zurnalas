import {useNavigation, useRoute} from '@react-navigation/native';
import {getExtendedHunting} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus, State, UserStatus} from '@root/state/types';
import {map} from 'lodash';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import ActionsModal from '../../components/ActionsModal';
import Button, {ButtonVariant} from '../../components/Button';
import PhoneIcon from '../../components/svg/Phone';
import {strings} from '../../strings';
import Confirmation from './Confirmation';

type Option = {
  key: string;
  text: string;
  disabled: boolean;
  onPress: () => void;
  variant?: ButtonVariant;
};

type Options = {
  [key: string]: Option;
};

const HuntingMemberConfirmationPanel = (): JSX.Element => {
  const route: any = useRoute();
  const {member, huntingId} = route.params;

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const huntingData = useSelector(getExtendedHunting(huntingId));
  const myHuntingMember = useSelector(getMyHuntingMember(huntingId));
  const loadingHunting = useSelector(getOnSync.huntings);
  const loadingMember = useSelector(getOnSync.huntingMember);

  const loading = loadingMember || loadingHunting;

  const [allTermsConfirmed, confirmAllTerms] = useState(false);
  const [loadingOption, setLoaderOnOption] = useState('');

  const huntingStatus = huntingData?.status;

  const handleOptionPress = (option: {
    key: string;
    text: string;
    onPress: () => void;
    variant?: ButtonVariant;
  }) => {
    setLoaderOnOption(option.key);
    option.onPress();
  };

  const allOptions: Options = {
    confirmMyself: {
      key: 'confirmMyself',
      text: strings.memberOptions.confirmMyself,
      disabled: !allTermsConfirmed || !isConnected,
      onPress: () => {
        if (myHuntingMember?.id) {
          dispatch(
            huntingActions.updateHuntingMember(
              {
                memberId: myHuntingMember.id,
                data: {
                  status: UserStatus.Accepted,
                },
              },
              {
                onFinish: () => {
                  navigation.goBack();
                },
              },
            ),
          );
          navigation.goBack();
        }
      },
    },
    decline: {
      key: 'decline',
      text: strings.memberOptions.decline,
      variant: Button.Variant.Danger,
      onPress: () => {
        if (myHuntingMember?.id) {
          if (huntingStatus === HuntingStatus.Created) {
            dispatch(
              huntingActions.removeHuntingMember({
                memberId: member?.id,
              }),
            );
          } else {
            dispatch(
              huntingActions.updateHuntingMember(
                {
                  memberId: myHuntingMember.id,
                  data: {
                    status: UserStatus.Declined,
                  },
                },
                {
                  onFinish: () => {
                    navigation.goBack();
                  },
                },
              ),
            );
            navigation.goBack();
          }
        }
      },
      disabled: !isConnected,
    },
  };

  const getAvailableOptions = () => {
    return map(allOptions, (option: Option, index: number) => (
      <OptionButton
        key={option.key}
        text={option.text}
        loading={loading && option.key === loadingOption}
        disabled={option.disabled || loading}
        leftIcon={option.key === 'phone' ? <PhoneIcon /> : null}
        onPress={() => handleOptionPress(option)}
        variant={
          option.variant
            ? option.variant
            : index === 0
            ? Button.Variant.PrimaryDark
            : Button.Variant.Primary
        }
      />
    ));
  };

  return (
    <ActionsModal scrollable>
      <>
        <Confirmation
          huntingId={huntingId}
          confirmAllTerms={val => confirmAllTerms(val)}
        />
        <Container>{getAvailableOptions()}</Container>
      </>
    </ActionsModal>
  );
};

const Container = styled(View)`
  padding: 0px 20px 20px 20px;
`;

const OptionButton = styled(Button)`
  margin-top: 24px;
`;

export default HuntingMemberConfirmationPanel;
