import {getOnSync} from '@root/state/sync/syncSelectors';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ButtonFooter from '../../components/ButtonFooter';
import RadioButtonCard from '../../components/RadioButtonCard';
import SegmentedTabbar from '../../components/SegmentedTabbar';
import Text from '../../components/Text';
import {AnimalAge, AnimalCategory, WolfHuntingType} from '../../state/types';
import {strings} from '../../strings';
import {goBack} from '../../utils/navigation';

interface LootData {
  category: AnimalCategory;
  age: AnimalAge;
  wolfHuntingType: WolfHuntingType;
}

type LootProps = {
  onPress: (val: LootData) => void;
};

const GenderAge = ({onPress}: LootProps) => {
  const loading = useSelector(getOnSync.loot);

  const [category, setCategory] = useState<AnimalCategory>(AnimalCategory.Male);
  const [age, setAge] = useState<AnimalAge>(AnimalAge.Adult);
  const [wolfHuntingType, setWolfHuntingType] =
    useState<WolfHuntingType | null>(null);

  const routesGender = [
    {key: AnimalCategory.Male, title: strings.MALE},
    {key: AnimalCategory.Female, title: strings.FEMALE},
  ];

  const routesAge = [
    {key: AnimalAge.TwoYear, title: strings.TWO_YEAR},
    {key: AnimalAge.OneYear, title: strings.ONE_YEAR},
  ];

  return (
    <Wrapper>
      <View>
        <HuntingTypeQuestion>
          <Name variant={Text.Variant.primaryDark}>
            {strings.wolfHuntingTypeQuestion}
          </Name>
          {Object.values(WolfHuntingType).map(type => {
            const selected = wolfHuntingType === type;
            return (
              <RadioButtonCard
                key={type}
                label={strings.wolfHuntingType[type]}
                value={type}
                onPress={() => setWolfHuntingType(type)}
                selected={selected}
              />
            );
          })}
        </HuntingTypeQuestion>
        <SegmentedTabbar
          routes={routesGender}
          label={strings.gender}
          onSelect={setCategory}
        />
        <SegmentedTabbar
          routes={routesAge}
          label={strings.age}
          onSelect={setAge}
        />
      </View>
      <ButtonFooter
        primaryButton={{
          action: () =>
            wolfHuntingType &&
            onPress({
              category,
              age,
              wolfHuntingType,
            }),
          text: strings.common.continue,
          disabled: !wolfHuntingType,
          loading: loading,
        }}
        secondaryButton={{
          action: goBack,
          text: strings.common.back,
          disabled: loading,
        }}
      />
    </Wrapper>
  );
};

const Name = styled(Text.M)`
  margin: 0 16px 6px 16px;
`;

const HuntingTypeQuestion = styled(View)`
  margin-bottom: 28px;
`;

const Wrapper = styled(View)`
  background-color: white;
  justify-content: space-between;
  flex: 1;
`;

export default GenderAge;
