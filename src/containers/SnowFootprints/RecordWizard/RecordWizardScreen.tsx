import Text from '@components/Text';
import {RouteProp, useNavigation} from '@react-navigation/native';
import ButtonFooter from '@root/components/ButtonFooter';
import HeaderClose from '@root/components/HeaderClose';
import ProgressBar from '@root/components/ProgressBar';
import {FootprintRecordRegistrationSteps} from '@root/constants';
import {RootStackParamList, routes} from '@root/containers/Router';
import {footprintActions} from '@root/state/snowFootprints/actions';
import {strings} from '@root/strings';
import {getWidth} from '@root/utils/layout';
import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';

type ObservationWizardRouteProp = RouteProp<
  RootStackParamList,
  routes.footPrintRecordWizard
>;

interface Props {
  route: ObservationWizardRouteProp;
}

interface TmpRecord {
  date: Date;
  trail?: any;
}

const RecordWizardScreen: React.FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [stepIndex, setStepIndex] = useState(0);
  const [tmpRecord, setTmpRecord] = useState<TmpRecord>({
    date: new Date(),
  });
  const WizardSteps: string[] = Object.values(FootprintRecordRegistrationSteps);

  const handleTmpRecordUpdate = (key: string, value: any) => {
    setTmpRecord({...tmpRecord, [key]: value});
  };

  const handleStepChange = (isNext: boolean) => {
    setStepIndex(isNext ? stepIndex + 1 : stepIndex - 1);
  };

  const handleCreateObservation = () => {
    tmpRecord?.trail &&
      dispatch(
        footprintActions.createFootprintObservation({
          footprintTrack: tmpRecord.trail.marsrutoNr,
          eventTime: tmpRecord.date.toISOString(),
        }),
      );
  };

  const renderStepContent = () => {
    switch (WizardSteps[stepIndex]) {
      case FootprintRecordRegistrationSteps.AnimalSelect:
        return (
          <Container>
            <StepHeaderContainer>
              <Text.Heading weight={Text.Weight.regular}>
                {'Pasirink :'}
              </Text.Heading>
            </StepHeaderContainer>
            <Text.M>List here</Text.M>
          </Container>
        );
      case FootprintRecordRegistrationSteps.LootMainData:
        return null;
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
      {WizardSteps[stepIndex] !== FootprintRecordRegistrationSteps.GeoMap && (
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

export default RecordWizardScreen;
