import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {routes} from '../../containers/Router';
import {ExtendedHuntingAreaData} from '../../state/data/dataSelectors';
import {strings} from '../../strings';
import RightIcon from '../svg/Right';
import Text from '../Text';

const SelectedHuntingArea = ({
  selectedHuntingArea,
}: {
  selectedHuntingArea: ExtendedHuntingAreaData | null;
}) => {
  const navigation = useNavigation<any>();
  const tenantName = selectedHuntingArea
    ? selectedHuntingArea?.tenant?.name
    : '';

  return (
    <Container onPress={() => navigation.navigate(routes.huntingAreaSwitch)}>
      <Column>
        <Text.M variant={Text.Variant.secondary} weight={Text.Weight.medium}>
          {selectedHuntingArea ? tenantName : strings.myHuntings}
        </Text.M>
        <HuntingAreaWrapper>
          <Text.M
            variant={Text.Variant.light}
            weight={Text.Weight.medium}
            numberOfLines={1}
          >
            {selectedHuntingArea
              ? selectedHuntingArea?.name
              : strings.personalHuntings}
          </Text.M>
        </HuntingAreaWrapper>
      </Column>
      <RightIcon color="white" />
    </Container>
  );
};

const Container = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.colors.primary};
  margin-bottom: 4px;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HuntingAreaWrapper = styled(View)`
  padding: 2px 0 0 0;
`;

const Column = styled(View)`
  flex: 1;
`;

export default SelectedHuntingArea;
