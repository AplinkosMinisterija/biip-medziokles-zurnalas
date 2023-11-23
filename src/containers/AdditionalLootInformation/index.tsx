import {RouteProp, useRoute} from '@react-navigation/native';
import {huntingActions} from '@root/state/huntings/actions';
import {AnimalAttributes, LootUpdateData} from '@root/state/types';
import React, {useState} from 'react';
import {
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import ProgressBar from '../../components/ProgressBar';
import Text from '../../components/Text';
import {AdditionalLootInformationSteps} from '../../constants';
import {strings} from '../../strings';
import {getWidth} from '../../utils/layout';
import {RootStackParamList, routes} from '../Router';
import Appearance from './Appearance';
import GenderAge from './GenderAge';
import Pack from './Pack';

type LootForm = {
  amount: number;
  attributes: AnimalAttributes;
};

const AdditionalLootInformation = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, routes.additionalLootInformation>>();
  const {loot} = route.params;
  const dispatch = useDispatch();
  const additionalSteps = [
    AdditionalLootInformationSteps.GenderAge,
    AdditionalLootInformationSteps.Appearance,
    AdditionalLootInformationSteps.Pack,
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [lootData, setLootData] = useState<LootForm>({
    attributes: loot.attributes,
    amount: 1,
  });

  const handleLootDataUpdate = (value: any) => {
    if (value) {
      const data = {...lootData, ...value};
      setLootData(data);
      onNext(data);
    }
  };

  const onNext = (data: LootForm) => {
    if (stepIndex === additionalSteps.length - 1) {
      dispatch(
        huntingActions.updateLoot({
          id: loot.id,
          huntingMember: loot.huntingMember.id,
          animal: loot.animal.id,
          ...data,
        } as LootUpdateData),
      );
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const onBack = () => {
    setStepIndex(stepIndex - 1);
  };

  const renderStepContent = () => {
    switch (additionalSteps[stepIndex]) {
      case AdditionalLootInformationSteps.GenderAge:
        return (
          <GenderAge
            onPress={val => {
              handleLootDataUpdate({
                ...lootData,
                attributes: {...lootData.attributes, ...val},
              });
            }}
          />
        );
      case AdditionalLootInformationSteps.Appearance:
        return (
          <Appearance
            onBack={onBack}
            onPress={val => {
              handleLootDataUpdate({
                ...lootData,
                attributes: {...lootData.attributes, ...val},
              });
            }}
          />
        );
      case AdditionalLootInformationSteps.Pack:
        return (
          <Pack
            onBack={onBack}
            onPress={val => {
              handleLootDataUpdate({
                ...lootData,
                attributes: {...lootData.attributes, ...val},
              });
            }}
            isLastStep={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper onPress={Keyboard.dismiss}>
      <Container>
        <StatusBar barStyle="dark-content" />
        <HeaderClose title={strings.aditionalData} shadow={false} />
        <ProgressBar
          barWidth={getWidth()}
          value={stepIndex + 1}
          maxValue={additionalSteps.length}
          initValue={stepIndex}
        />
        <Name variant={Text.Variant.secondary} weight={Text.Weight.bold}>
          {loot.animal?.name}
        </Name>
        {renderStepContent()}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled(TouchableWithoutFeedback)`
  flex: 1;
  background-color: white;
`;

const Container = styled(View)`
  background-color: white;
  flex: 1;
`;

const Name = styled(Text.M)`
  text-align: center;
  margin-bottom: 28px;
  margin-top: 16px;
`;

export default AdditionalLootInformation;
