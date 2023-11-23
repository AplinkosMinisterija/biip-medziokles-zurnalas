import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SvgUri} from 'react-native-svg';
import styled from 'styled-components';
import CheckIcon from '../../components/svg/Check';
import Text from '../../components/Text';
import {theme} from '../../theme';

type AnimalOptionCardProps = {
  onPress: () => void;
  label: string;
  selected: boolean;
  index: number;
  icon: string;
};

const AnimalOptionCard = ({
  label,
  selected,
  onPress,
  index,
  icon,
}: AnimalOptionCardProps) => {
  const highlight = index % 2 === 0;
  return (
    <TouchableCard
      activeOpacity={0.8}
      onPress={onPress}
      selected={selected}
      highlight={highlight}
    >
      <Wrapper>
        <SvgUri
          uri={icon}
          width="32px"
          height="22px"
          fill={selected ? 'white' : theme.colors.primaryLight}
        />
        <Label variant={Text.Variant.primaryDark} selected={selected}>
          {label}
        </Label>
      </Wrapper>
      {selected && (
        <CheckWrapper>
          <CheckIcon size={13} />
        </CheckWrapper>
      )}
    </TouchableCard>
  );
};

const TouchableCard = styled(TouchableOpacity)<{
  selected: boolean;
  highlight: boolean;
}>`
  width: 100%;
  flex-direction: row;
  padding: 12px 16px;
  background-color: ${({selected, highlight, theme}) =>
    selected ? theme.colors.primaryDark : highlight ? '#A5B9C026' : 'white'};
  justify-content: space-between;
  align-items: center;
`;

const CheckWrapper = styled(View)`
  height: 18px;
  width: 18px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.secondary};
`;

const Wrapper = styled(View)`
  flex-direction: row;
`;

const Label = styled(Text.M)<{selected: boolean}>`
  line-height: 21px;
  margin-left: 16px;
  max-width: 90%;
  color: ${({selected, theme}) =>
    selected ? 'white' : theme.colors.primaryDark};
`;

export default AnimalOptionCard;
