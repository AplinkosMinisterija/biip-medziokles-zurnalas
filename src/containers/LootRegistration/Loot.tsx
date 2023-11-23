import ButtonFooter from '@components/ButtonFooter';
import SegmentedTabbar from '@components/SegmentedTabbar';
import Text from '@components/Text';
import {Padding} from '@root/components/layout';
import TextField from '@root/components/TextField';
import {getAnimal} from '@root/state/data/dataSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {strings} from '@root/strings';
import {
  AnimalAge,
  AnimalAttributes,
  AnimalCategory,
  AnimalFormTypes,
  LootCaseType,
} from '@state/types';
import {some} from 'lodash';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import AmountInput from './AmountInput';
import ExtraCase from './ExtraCase';

interface LootData {
  amount: number;
  attributes?: AnimalAttributes;
}

type LootProps = {
  id: string;
  isLastStep: boolean;
  onPress: (val: LootData) => void;
  onBack: () => void;
  selectedCase: LootCaseType;
  setSelectedCase: (value: LootCaseType) => void;
  isExtraCase: boolean;
  setExtraCase: (value: boolean) => void;
};

const Loot = ({
  onPress,
  id,
  onBack,
  isLastStep,
  selectedCase,
  setSelectedCase,
  isExtraCase,
  setExtraCase,
}: LootProps) => {
  const loading = useSelector(getOnSync.loot);
  const [amount, setAmount] = useState(1);
  const [category, setCategory] = useState<AnimalCategory>(AnimalCategory.Male);
  const [age, setAge] = useState<AnimalAge>(AnimalAge.Adult);
  const [otherLootName, setOtherLootName] = useState('');
  const [otherLootNameError, setOtherLootNameError] = useState('');
  const [horns, setHorns] = useState<{left: number; right: number}>({
    left: 0,
    right: 0,
  });

  const routes = [
    {key: AnimalCategory.Male, title: strings.MALE},
    {key: AnimalCategory.Female, title: strings.FEMALE},
    {key: AnimalCategory.Junior, title: strings.JUNIOR},
  ];

  const routesExtended = [
    {key: AnimalCategory.Male, title: strings.MALE},
    {key: AnimalCategory.Female, title: strings.FEMALE},
  ];

  const routesAge = [
    {key: AnimalAge.Adult, title: strings.ADULT},
    {key: AnimalAge.TwoYear, title: strings.TWO_YEAR},
    {key: AnimalAge.OneYear, title: strings.ONE_YEAR},
  ];

  const animal = useSelector(getAnimal(id));

  const hasCategory =
    animal?.formType === AnimalFormTypes.Horned ||
    animal?.formType === AnimalFormTypes.Extended;

  const hasHorns =
    animal?.formType === AnimalFormTypes.Horned &&
    category === AnimalCategory.Male;

  const hasAge = animal?.formType === AnimalFormTypes.Extended;

  const renderForm = () => {
    if (animal.formType == AnimalFormTypes.Horned) {
      return (
        <>
          <SegmentedTabbar
            routes={routes}
            onSelect={val => {
              setCategory(val);
              setHorns({left: 0, right: 0});
              setAmount(1);
            }}
          />
          {some(
            [AnimalCategory.Female, AnimalCategory.Junior],
            c => c === category,
          ) ? (
            <AmountInput
              value={amount}
              label={strings.amount}
              onPress={val => setAmount(val)}
            />
          ) : (
            <View>
              <Label variant={Text.Variant.primaryDark}>
                {strings.branchCount}
              </Label>
              <AmountInput
                value={horns?.right || 0}
                label={strings.rightHorn}
                onPress={val => setHorns({...horns, right: val})}
              />
              <AmountInput
                value={horns?.left || 0}
                label={strings.leftHorn}
                onPress={val => setHorns({...horns, left: val})}
              />
            </View>
          )}
        </>
      );
    } else if (animal.formType == AnimalFormTypes.Extended) {
      return (
        <>
          <SegmentedTabbar
            routes={routesExtended}
            onSelect={val => {
              setCategory(val);
              setHorns({left: 0, right: 0});
              setAmount(1);
            }}
          />
          <SegmentedTabbar routes={routesAge} onSelect={setAge} />
        </>
      );
    } else if (animal.formType == AnimalFormTypes.Other) {
      return (
        <>
          <AmountInput
            value={amount}
            label={strings.amount}
            onPress={val => setAmount(val)}
          />
          <Padding horizontal={20} vertical={20}>
            <TextField
              error={otherLootNameError}
              name="otherLootName"
              value={otherLootName}
              onChangeText={setOtherLootName}
              label="Sumedžiotos rūšies pavadinimas"
            />
          </Padding>
        </>
      );
    } else {
      return (
        <>
          <AmountInput
            value={amount}
            label={strings.amount}
            onPress={val => setAmount(val)}
          />
        </>
      );
    }
  };

  return (
    <Wrapper>
      <ScrollView>
        {renderForm()}
        <ExtraCaseWrapper>
          <ExtraCase
            isExtraCase={isExtraCase}
            setExtraCase={setExtraCase}
            selectedCase={selectedCase}
            setSelectedCase={setSelectedCase}
          />
        </ExtraCaseWrapper>
      </ScrollView>
      <ButtonFooter
        primaryButton={{
          action: () => {
            if (
              animal.formType == AnimalFormTypes.Other &&
              otherLootName === ''
            ) {
              setOtherLootNameError('Privalomas laukas');
            } else {
              onPress({
                amount,
                attributes: {
                  ...(otherLootName && {
                    other: {
                      name: otherLootName,
                    },
                  }),
                  ...(hasCategory && {category}),
                  ...(hasHorns && {horns}),
                  ...(hasAge && {age}),
                },
              });
            }
          },
          text: isLastStep ? strings.common.save : strings.common.continue,
          disabled:
            !amount ||
            (hasCategory && !category) ||
            loading ||
            (isExtraCase && selectedCase === LootCaseType.standard),
        }}
        secondaryButton={{
          action: onBack,
          text: strings.common.back,
          disabled: loading,
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  padding-top: 16px;
  background-color: white;
  justify-content: space-between;
  flex: 1;
`;

const ExtraCaseWrapper = styled(View)`
  margin-top: 20px;
`;

const Label = styled(Text.M)`
  line-height: 22px;
  margin: 0px 16px 8px 16px;
`;

export default Loot;
