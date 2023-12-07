import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {
  getAnimal,
  getExtendedHuntingMember,
} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {amIHuntingAdmin} from '@root/state/huntings/huntingsSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {
  AnimalAttributes,
  AnimalComment,
  AnimalFormTypes,
  LootCaseType,
  NATIONALITY,
} from '@root/state/types';
import {getWidth} from '@utils/layout';
import React, {useMemo, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import ProgressBar from '../../components/ProgressBar';
import {LootRegistrationSteps} from '../../constants';
import {strings} from '../../strings';
import {RootStackParamList, routes} from '../Router';
import Commentary from './Commentary';
import ExtraCaseStep from './ExtraCaseStep';
import GeoMap from './GeoMap';
import Loot from './Loot';
import LootConfirm from './LootConfirm';
import SelectAnimal from './SelectAnimal';

// TODO remove this type and use some global one
type LootForm = {
  animal: string;
  amount: number;
  signature?: string;
  attributes: AnimalAttributes;
};

type LootRegistrationRouteProp = RouteProp<
  RootStackParamList,
  routes.lootRegistration
>;

const LootRegistration = () => {
  const navigation = useNavigation();
  const route = useRoute<LootRegistrationRouteProp>();
  const {huntingMemberId, huntingAreaMPVId} = route.params;
  const dispatch = useDispatch();

  const [isWolf, setIsWolf] = useState(false);
  // TODO refactor this mess :(((
  // controls for extra cases that alter navigation
  const [selectedCase, setSelectedCase] = useState(LootCaseType.standard);
  const [isExtraCase, setExtraCase] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [lootData, setLootData] = useState<LootForm>({
    animal: '',
    attributes: {
      lootCase: LootCaseType.standard,
    },
    amount: 1,
  });

  const animal = useSelector(getAnimal(lootData.animal));
  const huntingMember = useSelector(getExtendedHuntingMember(huntingMemberId));
  const iAmHuntingManager = useSelector(amIHuntingAdmin(huntingMember.hunting));
  const huntingMemberIsForeigner =
    huntingMember.user.nationality === NATIONALITY.foreigner;
  const shouldSign = iAmHuntingManager && huntingMemberIsForeigner;

  const registrationSteps = useMemo(() => {
    const steps = isWolf
      ? [
          LootRegistrationSteps.AnimalSelect,
          LootRegistrationSteps.ExtraCase,
          LootRegistrationSteps.GeoMap,
        ]
      : [
          LootRegistrationSteps.AnimalSelect,
          LootRegistrationSteps.LootMainData,
        ];

    if (animal?.formType && animal?.formType === AnimalFormTypes.Other) {
      steps.push(LootRegistrationSteps.Commentary);
    } else if (selectedCase !== LootCaseType.standard) {
      steps.push(LootRegistrationSteps.Commentary);
    }
    if (
      shouldSign &&
      steps.findIndex(step => step === LootRegistrationSteps.Sign)
    ) {
      steps.push(LootRegistrationSteps.Sign);
    }
    return steps;
  }, [isWolf, shouldSign, animal, selectedCase]);

  const getDataToConfirm = (data: LootForm) => {
    const name = animal?.name;
    const gender = data.attributes.category;
    const age = data.attributes.age;
    const amount = data.amount;

    return `${name} ${
      gender && age
        ? `(${strings[gender] || ''}${age ? `${strings[age]})` : ')'}`
        : ''
    }${amount > 1 ? ` x${amount}` : ''}`;
  };

  const onNext = (data?: LootForm | null) => {
    if (stepIndex === registrationSteps.length - 1) {
      if (data) {
        if (shouldSign) {
          dispatch(
            huntingActions.registerLoot(
              {
                huntingMember: huntingMemberId,
                ...data,
                registeredAt: new Date(),
              },
              {onFinish: () => {}},
            ),
          );
          navigation.goBack();
        } else {
          dispatch(
            appActions.showConfirmationModal({
              visible: true,
              title: strings.confirmLoot,
              subtitle: strings.confirmLootSubtitle,
              primaryButton: strings.registerLoot,
              additionalData: getDataToConfirm(data),
              secondaryButton: strings.common.cancel,
              loadingSelector: getOnSync.loot,
              onPrimaryPress: () => {
                dispatch(
                  huntingActions.registerLoot(
                    {
                      huntingMember: huntingMemberId,
                      ...data,
                      registeredAt: new Date(),
                    },
                    {onFinish: () => {}},
                  ),
                );
                dispatch(appActions.closeConfirmationModal());
                navigation.goBack();
              },
            }),
          );
        }
      }
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const onBack = () => {
    setStepIndex(stepIndex - 1);
  };

  const handleLootDataUpdate = (value: Partial<LootForm>) => {
    if (value) {
      const data = {...lootData, ...value};
      if (data.animal) {
        setLootData(data);
        onNext(data);
      }
    }
  };

  const renderStepContent = () => {
    switch (registrationSteps[stepIndex]) {
      case LootRegistrationSteps.AnimalSelect:
        return (
          <SelectAnimal
            selectedValue={lootData.animal}
            setIsWolfFlag={val => setIsWolf(val)}
            onSelect={val => {
              const data = {...lootData, animal: val};
              setLootData(data);
            }}
            onPress={() =>
              onNext(
                stepIndex === registrationSteps.length - 1 ? lootData : null,
              )
            }
            isLastStep={stepIndex === registrationSteps.length - 1}
          />
        );
      case LootRegistrationSteps.LootMainData:
        return (
          <Loot
            isExtraCase={isExtraCase}
            setExtraCase={setExtraCase}
            selectedCase={selectedCase}
            setSelectedCase={setSelectedCase}
            id={lootData.animal}
            onPress={val => {
              handleLootDataUpdate({...val});
            }}
            onBack={onBack}
            isLastStep={stepIndex === registrationSteps.length - 1}
          />
        );
      case LootRegistrationSteps.GeoMap:
        return (
          <GeoMap
            url={`https://maps.biip.lt/medziokle?mpvId=${huntingAreaMPVId}&draw=true`}
            onBack={onBack}
            isLastStep={stepIndex === registrationSteps.length - 1}
            onPress={coords => {
              handleLootDataUpdate({
                attributes: {
                  ...lootData.attributes,
                  geom: coords,
                },
              });
            }}
          />
        );
      case LootRegistrationSteps.Commentary:
        return (
          <Commentary
            onBack={onBack}
            isLastStep={stepIndex === registrationSteps.length - 1}
            isRequired={false}
            onPress={val => {
              let comments: AnimalComment[] = [];
              if (val !== '') {
                comments.push({
                  text: val,
                  createdAt: new Date(),
                });
              }
              handleLootDataUpdate({
                attributes: {
                  ...lootData.attributes,
                  comments,
                },
              });
            }}
          />
        );
      case LootRegistrationSteps.ExtraCase:
        // this one for Wolf only
        return (
          <ExtraCaseStep
            isExtraCase={isExtraCase}
            setExtraCase={setExtraCase}
            selectedCase={selectedCase}
            setSelectedCase={setSelectedCase}
            onBack={onBack}
            isLastStep={stepIndex === registrationSteps.length - 1}
            onPress={() => {
              handleLootDataUpdate({
                attributes: {
                  ...lootData.attributes,
                  lootCase: selectedCase,
                },
              });
            }}
          />
        );
      case LootRegistrationSteps.Sign:
        return (
          <LootConfirm
            lootData={lootData}
            huntingMember={huntingMemberId}
            onPress={val => {
              handleLootDataUpdate({signature: val});
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" />
      <HeaderClose
        title={(stepIndex > 0 && animal?.name) || strings.loot}
        shadow={false}
      />
      <ProgressBar
        barWidth={getWidth()}
        value={lootData.animal ? stepIndex + 1 : 0}
        maxValue={registrationSteps.length}
        initValue={lootData.animal ? stepIndex : 0}
      />

      <Content>{renderStepContent()}</Content>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  flex: 1;
  background-color: white;
`;

const Content = styled(View)`
  flex: 1;
`;

export default LootRegistration;
