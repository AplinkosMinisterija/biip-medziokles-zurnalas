import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import CheckIcon from './svg/Check';
import Text from './Text';

type CheckboxCardProps = {
  onPress: () => void;
  label: string;
  selected: boolean;
  style?: any;
  disabled?: boolean;
};

const CheckboxCard: React.FC<CheckboxCardProps> = ({
  label,
  selected,
  onPress,
  style,
  disabled = false,
}) => {
  return (
    <TouchableCard
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      selected={selected}
      style={style}
    >
      <ButtonWrapper disabled={disabled} selected={selected}>
        {selected && <CheckIcon size={13} />}
      </ButtonWrapper>
      <Label disabled={disabled} variant={Text.Variant.primaryDark}>
        {label}
      </Label>
    </TouchableCard>
  );
};

const TouchableCard = styled(TouchableOpacity)<{
  selected: boolean;
}>`
  width: 100%;
  flex-direction: row;
  padding-top: 16px;
  margin: 2px;
  border-radius: 2px;
  flex-direction: row;
`;

const ButtonWrapper = styled(View)<{disabled: boolean; selected: boolean}>`
  height: 20px;
  width: 20px;
  border-radius: 4px;
  border-width: 2px;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  margin-top: 2px;
  border-color: ${({disabled, theme}) =>
    disabled ? theme.colors.primaryLight : theme.colors.primaryDark};
  background-color: ${({selected, disabled, theme}) =>
    selected
      ? disabled
        ? theme.colors.primaryLight
        : theme.colors.primaryDark
      : 'white'};
`;

const Label = styled(Text.M)<{disabled: boolean; selected: boolean}>`
  color: ${({theme}) => theme.colors.primaryDark};
  line-height: 21px;
  max-width: 90%;
`;

export default CheckboxCard;
