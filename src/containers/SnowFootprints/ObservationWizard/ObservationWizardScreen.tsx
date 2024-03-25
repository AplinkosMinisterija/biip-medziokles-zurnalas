import Text from '@components/Text';
import {RouteProp, useNavigation} from '@react-navigation/native';
import ButtonFooter from '@root/components/ButtonFooter';
import HeaderClose from '@root/components/HeaderClose';
import ProgressBar from '@root/components/ProgressBar';
import {NewFootprintObservationSteps} from '@root/constants';
import {RootStackParamList, routes} from '@root/containers/Router';
import {footprintActions} from '@root/state/snowFootprints/actions';
import {strings} from '@root/strings';
import {getWidth, isIOS} from '@root/utils/layout';
import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import WizardTrails from './WizardTrails';

type ObservationWizardRouteProp = RouteProp<
  RootStackParamList,
  routes.footPrintWizard
>;

interface Props {
  route: ObservationWizardRouteProp;
}

export interface TrailData {
  id: number;
  createDate: string;
  ilgisKm: number;
  lastModified: string;
  marsrutoNr: number;
  mpvId: number;
  raad: string;
  savivalda: string;
  teritorija: string;
  featureId: string;
}

interface TmpObservation {
  date: Date;
  trail?: TrailData;
}

const ObservationWizardScreen: React.FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {huntingAreaId, mpvId} = route.params;
  const [stepIndex, setStepIndex] = useState(0);
  const [tmpObservation, setTmpObservation] = useState<TmpObservation>({
    date: new Date(),
  });
  const WizardSteps: string[] = Object.values(NewFootprintObservationSteps);

  const handleTmpObservationUpdate = (key: string, value: any) => {
    setTmpObservation({...tmpObservation, [key]: value});
  };

  const handleStepChange = (isNext: boolean) => {
    setStepIndex(isNext ? stepIndex + 1 : stepIndex - 1);
  };

  const handleCreateObservation = () => {
    tmpObservation?.trail &&
      dispatch(
        footprintActions.createFootprintObservation({
          footprintTrack: tmpObservation.trail.id,
          eventTime: tmpObservation.date.toISOString(),
          huntingArea: huntingAreaId,
        }),
      );
  };

  const renderStepContent = () => {
    switch (WizardSteps[stepIndex]) {
      case NewFootprintObservationSteps.Date:
        return (
          <Container>
            <StepHeaderContainer>
              <Text.Heading weight={Text.Weight.regular}>
                {
                  strings.footprintWizardSteps[
                    NewFootprintObservationSteps.Date
                  ]
                }
              </Text.Heading>
            </StepHeaderContainer>
            <DatePicker
              date={tmpObservation.date}
              onDateChange={(date: Date) =>
                handleTmpObservationUpdate(
                  NewFootprintObservationSteps.Date,
                  date,
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
      case NewFootprintObservationSteps.Trail:
        return (
          <WizardTrails
            selectedTrial={tmpObservation.trail}
            setSelectedTrial={trail =>
              handleTmpObservationUpdate(
                NewFootprintObservationSteps.Trail,
                trail,
              )
            }
            onBack={() => handleStepChange(false)}
            onNext={handleCreateObservation}
            mpvId={mpvId}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={'Naujas stebėjimas'} shadow={false} />
      <ProgressBar
        barWidth={getWidth()}
        value={stepIndex + 1}
        maxValue={WizardSteps.length}
      />
      {renderStepContent()}
      {WizardSteps[stepIndex] !== NewFootprintObservationSteps.Trail && (
        <ButtonFooter
          style={{
            bottom: 0,
          }}
          primaryButton={{
            action: () => {
              stepIndex === WizardSteps.length - 1
                ? handleCreateObservation()
                : handleStepChange(true);
            },
            text:
              stepIndex === WizardSteps.length - 1
                ? strings.common.save
                : strings.common.continue,
            disabled: false,
            loading: false,
          }}
          secondaryButton={{
            action: () => {
              stepIndex === 0 ? navigation.goBack() : handleStepChange(false);
            },
            text: stepIndex === 0 ? strings.common.cancel : strings.common.back,
            disabled: false,
          }}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  flex: 1;
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

export default ObservationWizardScreen;
