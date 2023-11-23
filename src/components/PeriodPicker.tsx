import {format} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {SeasonData} from '../state/types';
import {theme} from '../theme';
import BackButton from './BackButton';
import Text from './Text';

interface PeriodPickerProps {
  selectedSeason: SeasonData;
  index: number;
  count: number;
  onBackPress: () => void;
  onForwardPress: () => void;
}

const PeriodPicker = ({
  selectedSeason,
  index,
  count,
  onBackPress,
  onForwardPress,
}: PeriodPickerProps) => {
  return (
    <Container>
      <BackButton
        onPress={() => (index !== 0 ? onBackPress() : null)}
        color={theme.colors.primaryLight}
        disabled={index === 0}
      />

      <Label variant={Text.Variant.primary}>{`SEZONAS ${format(
        new Date(selectedSeason.startDate),
        'yyyy',
      )}/${format(new Date(selectedSeason.endDate), 'yyyy')}`}</Label>

      <BackButton
        back={false}
        onPress={() => (index != count - 1 ? onForwardPress() : null)}
        color={theme.colors.primaryLight}
        disabled={index === count - 1}
      />
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 28px 0;
`;

const Label = styled(Text.S)`
  margin: 0 16px;
`;

export default PeriodPicker;
