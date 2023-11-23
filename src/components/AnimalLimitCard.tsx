import {routes} from '@containers/Router';
import {useNavigation} from '@react-navigation/native';
import {strings} from '@root/strings';
import {ExtendedLimitedAnimalData, SeasonData} from '@state/types';
import {getWidth, isIOS} from '@utils/layout';
import {isEmpty, map} from 'lodash';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {SvgUri} from 'react-native-svg';
import styled from 'styled-components';
import {theme} from '../theme';
import LimitsProgressBar from './LimitsProgressBar';
import Text from './Text';

type AnimalLimitProps = {
  animal: ExtendedLimitedAnimalData;
  editMode: boolean;
  onChange?: (val: string) => void;
  selectedSeason?: SeasonData;
  huntingAreaSelected: boolean;
};

const AnimalLimitCard = ({
  animal,
  editMode,
  onChange,
  selectedSeason,
  huntingAreaSelected,
}: AnimalLimitProps) => {
  const navigation = useNavigation<any>();
  const [focused, setIsFocused] = useState(false);

  const categories = isEmpty(animal.categories)
    ? ''
    : ` (${map(animal.categories, ac => strings[ac]).join()})`;

  const showLimit: boolean = animal?.type !== null && huntingAreaSelected;
  return (
    <Container
      onPress={() => {
        if (animal?.stats?.loots && selectedSeason) {
          navigation.navigate(routes.animalStatistics, {
            limitedAnimalId: animal.id,
            selectedSeason,
          });
        }
      }}
      disabled={editMode}
    >
      <MainDataRow hasLimit={showLimit}>
        <ImageWrapper>
          {animal.animal.iconUrl && (
            <SvgUri
              uri={animal.animal.iconUrl}
              width="32px"
              height="22px"
              fill={theme.colors.primaryLight}
            />
          )}
        </ImageWrapper>
        <Row>
          <Wrapper>
            <AnimalName variant={Text.Variant.primaryDark}>
              {animal.animal.name}
              {categories}
            </AnimalName>
            <LimitText>
              <Text.L weight={Text.Weight.bold}>
                {animal.stats?.loots || 0}
              </Text.L>
              {showLimit && <Text.L>{` / ${animal.stats?.limit || 0}`}</Text.L>}
            </LimitText>
          </Wrapper>
          {editMode && onChange && (
            <StyledTextInput
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              focused={focused}
              onChangeText={val => onChange(String(val))}
              value={`${animal.stats?.pending || ''}`}
              keyboardType={isIOS ? 'number-pad' : 'numeric'}
              returnKeyType="done"
              placeholder={'0'}
              allowFontScaling={false}
            />
          )}
          {!editMode && !!animal.stats?.pending && (
            <RequestedLimitData>
              <Text.L>{`+${animal.stats?.pending}`}</Text.L>
            </RequestedLimitData>
          )}
        </Row>
      </MainDataRow>
      {showLimit && (
        <LimitsProgressBar
          barWidth={getWidth() - 48}
          value={animal.stats?.loots || 0}
          maxValue={(animal.stats?.limit || 0) + (animal.stats?.pending || 0)}
          secondValue={animal.stats?.limit}
        />
      )}
      {/* {!editMode && !!animal.stats?.pending && (
        <StatusWrapper>
          <Text.S>{strings.waitingApproval}</Text.S>
        </StatusWrapper>
      )} */}
    </Container>
  );
};

const Container = styled(TouchableOpacity)`
  padding: 12px;
  background-color: white;
  align-items: center;
  margin: 8px 16px;
  border-radius: 8px;
  flex-grow: 1;
  ${({theme}) => theme.shadow.light};
`;

const Wrapper = styled(View)`
  margin-left: 8px;
  margin-right: 8px;
  justify-content: space-between;
  flex: 1;
`;

const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const RequestedLimitData = styled(View)`
  align-self: flex-end;
`;

const MainDataRow = styled(View)<{hasLimit: boolean}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({hasLimit}) => hasLimit && 'margin-bottom: 12px'};
`;

const AnimalName = styled(Text.M)`
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const ImageWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  height: 48px;
  width: 48px;
  background-color: #edf1f2;
`;

const LimitText = styled(Text.L)`
  line-height: 24px;
`;

const StyledTextInput = styled(TextInput)<{focused: boolean}>`
  padding: 10px 8px 10px 8px;
  border-width: 1px;
  border-radius: 4px;
  border-color: ${({theme, focused}) =>
    focused ? theme.colors.primaryDark : '#c2d1d4'};
  background-color: white;
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 20px;
  height: 39px;
  width: 100px;
  text-align: right;
`;

export default AnimalLimitCard;
