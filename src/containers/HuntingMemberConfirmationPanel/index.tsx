import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {getExtendedHunting} from '@root/state/data/dataSelectors';
import {getMyHuntingMember} from '@root/state/huntingMembers/huntingMembersSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {State} from '@root/state/types';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import ActionsModal from '../../components/ActionsModal';
import Button, {ButtonVariant} from '../../components/Button';
import PhoneIcon from '../../components/svg/Phone';
import {strings} from '../../strings';
import {RootStackParamList, routes} from '../Router';
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
  const route =
    useRoute<
      RouteProp<RootStackParamList, routes.huntingMemberConfirmationPanel>
    >();
  const {huntingId, confirmWithNextStep, nextStep} = route.params;

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
            huntingActions.acceptHuntingMember(
              {
                memberId: myHuntingMember.id,
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
    nextStepOption: {
      key: 'nextStep',
      text: 'Toliau',
      disabled: !allTermsConfirmed || !isConnected,
      onPress: () => {
        navigation.goBack();
        nextStep && nextStep();
      },
    },
  };

  const renderOption = (option: Option, index?: number) => (
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
  );

  const getAvailableOptions = () => {
    if (confirmWithNextStep) {
      return renderOption(allOptions.nextStepOption);
    } else {
      return renderOption(allOptions.confirmMyself);
    }
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
