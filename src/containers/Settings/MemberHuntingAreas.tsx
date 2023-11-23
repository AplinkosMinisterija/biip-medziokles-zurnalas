import {without} from 'lodash';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import CheckboxCard from '../../components/CheckboxCard';
import Text from '../../components/Text';
import {ExtendedHuntingAreaData} from '../../state/data/dataSelectors';
import {HuntingAreaData} from '../../state/types';
import {strings} from '../../strings';

interface MemberHuntingAreasProps {
  onChange: (value: string[]) => void;
  availableHuntingAreas: ExtendedHuntingAreaData[];
  selectedHuntingAreas: string[];
  disabled?: boolean;
}

const MemberHuntingAreas = ({
  onChange,
  availableHuntingAreas,
  selectedHuntingAreas,
  disabled = false,
}: MemberHuntingAreasProps) => {
  const handleCheck = (areaId: string) => {
    let data: string[] = [];
    if (selectedHuntingAreas.includes(areaId)) {
      data = without(selectedHuntingAreas, areaId);
    } else {
      data = [...selectedHuntingAreas, areaId];
    }
    onChange(data);
  };

  return (
    <Column>
      <InfoText weight={Text.Weight.medium}>
        {`${strings.huntingAreas}:`}
      </InfoText>
      {availableHuntingAreas.map(
        (item: ExtendedHuntingAreaData | HuntingAreaData) => {
          const isSelected = (selectedHuntingAreas || []).includes(item.id);
          return (
            <StyledCheckboxCard
              disabled={disabled}
              key={item.id}
              label={item.name}
              selected={!!isSelected}
              onPress={() => handleCheck(item.id)}
            />
          );
        },
      )}
    </Column>
  );
};

const Column = styled(View)`
  margin-top: 24px;
`;

const InfoText = styled(Text.M)`
  margin: 8px 0;
`;

const StyledCheckboxCard = styled(CheckboxCard)`
  padding: 0;
  margin: 8px 0;
`;

export default MemberHuntingAreas;
