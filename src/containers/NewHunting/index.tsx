import {useNavigation} from '@react-navigation/native';
import {getSelectedHuntingArea} from '@root/state/app/appSelectors';
import {
  ExtendedHuntingData,
  getExtendedHunting,
} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingType, State} from '@root/state/types';
import {useKeyboard} from '@utils/hooks';
import {getWidth, isIOS} from '@utils/layout';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import ButtonFooter from '../../components/ButtonFooter';
import HeaderClose from '../../components/HeaderClose';
import ProgressBar from '../../components/ProgressBar';
import Text from '../../components/Text';
import {NewHuntingSteps} from '../../constants';
import {strings} from '../../strings';
import HuntingNotes from './HuntingNotes';

type NewHuntingProps = {
  route: {
    params?: {
      huntingId?: string;
    };
  };
};

const NewHunting = ({route: {params: {huntingId} = {}}}: NewHuntingProps) => {
  const isConnected = useSelector((state: State) => state.network.isConnected);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const openKeyboard = useKeyboard();

  const initHuntingData: ExtendedHuntingData | null = useSelector(
    getExtendedHunting(huntingId),
  );

  const loadingSave: boolean = useSelector(getOnSync.newHunting);
  const selectedHuntingArea: string | null = useSelector(
    getSelectedHuntingArea,
  );

  const HuntingFlowSteps: string[] = Object.values(NewHuntingSteps);

  const [stepIndex, setStepIndex] = useState(0);

  const [huntingData, setHuntingData] = useState<{
    id: string;
    type: HuntingType;
    date: string;
    notes: string | null;
    huntingArea: string | null;
  }>({
    id: '',
    type: HuntingType.varomoji,
    date: new Date().toISOString(),
    notes: null,
    huntingArea: selectedHuntingArea,
  });

  useEffect(() => {
    if (!huntingData.id && initHuntingData) {
      setHuntingData({
        id: initHuntingData.id,
        type: initHuntingData.type,
        date: initHuntingData.startDate,
        notes: initHuntingData.notes,
        huntingArea: selectedHuntingArea,
      });
    }
  }, [huntingData, initHuntingData, selectedHuntingArea]);

  const stepsTotal = HuntingFlowSteps.length;

  const handleStepChange = (isNext: boolean) => {
    setStepIndex(isNext ? stepIndex + 1 : stepIndex - 1);
  };

  const handleHuntingDataUpdate = (key: string, value: string) => {
    setHuntingData({...huntingData, [key]: value});
  };

  const handleCreateNewHunting = () => {
    dispatch(
      huntingActions.createHunting({
        huntingData,
        isEditing: Boolean(huntingData.id),
      }),
    );
  };

  const renderStepContent = () => {
    switch (HuntingFlowSteps[stepIndex]) {
      case NewHuntingSteps.Date:
        return (
          <Container>
            <DatePicker
              date={huntingData?.date ? new Date(huntingData.date) : new Date()}
              onDateChange={(date: Date) =>
                handleHuntingDataUpdate(
                  NewHuntingSteps.Date,
                  date.toISOString(),
                )
              }
              mode="datetime"
              is24hourSource="locale"
              style={isIOS ? {flex: 1} : undefined}
              minimumDate={new Date()}
              locale="lt"
              minuteInterval={15}
            />
          </Container>
        );
      case NewHuntingSteps.Notes:
        return (
          <HuntingNotes
            notes={huntingData.notes}
            onChangeText={val =>
              handleHuntingDataUpdate(NewHuntingSteps.Notes, val)
            }
          />
        );
      // case NewHuntingSteps.Type:
      //   return (
      //     <HuntingTypePicker
      //     // notes={huntingData.notes}
      //     // onChangeText={val =>
      //     //   handleHuntingDataUpdate(NewHuntingSteps.Notes, val)
      //     // }
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Wrapper>
        <StatusBar barStyle="dark-content" />
        <HeaderClose
          title={huntingId ? strings.common.edit : strings.newHunting}
          shadow={false}
        />
        <ProgressBar
          barWidth={getWidth()}
          value={stepIndex + 1}
          maxValue={stepsTotal}
        />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={isIOS ? 'padding' : 'height'}
        >
          <Wrapper>
            <StepHeaderContainer>
              <Text.Heading weight={Text.Weight.regular}>
                {strings.newHuntingSteps[HuntingFlowSteps[stepIndex]]}
              </Text.Heading>
            </StepHeaderContainer>
            {renderStepContent()}
          </Wrapper>
          <ButtonFooter
            style={{
              marginBottom: !isIOS && openKeyboard ? 22 : 0,
              position: !isIOS && openKeyboard ? 'absolute' : 'relative',
              bottom: 0,
            }}
            primaryButton={{
              action: () =>
                stepIndex === stepsTotal - 1
                  ? handleCreateNewHunting()
                  : handleStepChange(true),
              text:
                stepIndex === stepsTotal - 1
                  ? huntingId
                    ? strings.common.save
                    : strings.createNewHunting
                  : strings.common.continue,
              disabled: !huntingData.type || !isConnected,
              loading: loadingSave,
            }}
            secondaryButton={{
              action: () => {
                stepIndex === 0 ? navigation.goBack() : handleStepChange(false);
              },
              text:
                stepIndex === 0 ? strings.common.cancel : strings.common.back,
              disabled: loadingSave,
            }}
          />
        </KeyboardAvoidingView>
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

const Wrapper = styled(View)`
  flex-grow: 1;
  background-color: white;
`;

const StepHeaderContainer = styled(View)`
  margin: 32px 22px 24px 22px;
`;

const Container = styled(View)`
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export default NewHunting;
