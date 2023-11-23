import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import Text from '../components/Text';

enum RadioButtonVariant {
  regular = 'regular',
  reverse = 'reverse',
  rounded = 'rounded',
}

type RadioButtonCardProps = {
  onPress: (val: string | null) => void;
  label: string;
  value: string | null;
  selected: boolean;
  variant?: RadioButtonVariant;
  reverse?: boolean;
  style?: any;
  disabled?: boolean;
};

const getTextVariant = ({selected, variant}: any) => {
  switch (variant) {
    case RadioButtonVariant.reverse:
      return Text.Variant.light;
    case RadioButtonVariant.rounded:
      return selected ? Text.Variant.light : Text.Variant.primaryDark;
    default:
      return Text.Variant.primaryDark;
  }
};

const RadioButtonCard = ({
  label,
  value,
  selected,
  onPress,
  variant = RadioButtonVariant.regular,
  style,
  disabled,
}: RadioButtonCardProps) => {
  return (
    <TouchableCard
      onPress={() => onPress(value)}
      selected={selected}
      variant={variant}
      style={style}
      disabled={disabled}
    >
      <RadioButtonWrapper selected={selected} variant={variant}>
        <RadioButton selected={selected} variant={variant} />
      </RadioButtonWrapper>
      <Label
        variant={getTextVariant({selected, variant})}
        weight={Text.Weight.medium}
      >
        {label}
      </Label>
    </TouchableCard>
  );
};

const getBackgroundColor = ({theme, variant, selected}: any) => {
  switch (variant) {
    case RadioButtonVariant.reverse:
      return 'transparent';
    case RadioButtonVariant.rounded:
      return selected
        ? theme.colors.primaryDark
        : theme.colors.primaryUltraLight;
    default:
      return selected ? theme.colors.primaryUltraLight : 'transparent';
  }
};

const getRadioButtonBorderColor = ({theme, variant}: any) => {
  switch (variant) {
    case RadioButtonVariant.reverse:
      return theme.colors.white;
    case RadioButtonVariant.rounded:
      return 'transparent';
    default:
      return theme.colors.primaryDark;
  }
};

const getRadioButtonBackgroundColor = ({theme, variant}: any) => {
  switch (variant) {
    case RadioButtonVariant.rounded:
      return theme.colors.white;
    case RadioButtonVariant.reverse:
      return theme.colors.white;
    default:
      return 'transparent';
  }
};

const getRadioButtonColor = ({theme, variant, selected}: any) => {
  switch (variant) {
    case RadioButtonVariant.rounded:
      return selected ? theme.colors.primaryDark : 'transparent';
    case RadioButtonVariant.reverse:
      return selected ? theme.colors.primary : 'transparent';
    default:
      return selected ? theme.colors.primaryDark : 'transparent';
  }
};

const TouchableCard = styled(TouchableOpacity)<{
  variant: RadioButtonVariant;
  selected: boolean;
  disabled?: boolean;
}>`
  height: 44px;
  background-color: ${params => getBackgroundColor(params)};
  flex-direction: row;
  align-items: center;
  padding: ${({variant}) =>
    variant === RadioButtonVariant.rounded ? '0 16px' : '0 24px'};
  margin: ${({variant}) =>
    variant === RadioButtonVariant.rounded ? '2px 0' : '4px 0'};
  border-radius: ${({variant}) =>
    variant === RadioButtonVariant.rounded ? '8px' : 0};
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const RadioButtonWrapper = styled(View)<any>`
  height: 16px;
  width: 16px;
  border-radius: 8px;
  border-width: 1px;
  align-items: center;
  justify-content: center;
  border-color: ${params => getRadioButtonBorderColor(params)};
  background-color: ${params => getRadioButtonBackgroundColor(params)};
`;

const RadioButton = styled(View)<any>`
  background-color: ${params => getRadioButtonColor(params)};
  height: 10px;
  width: 10px;
  border-radius: 5px;
`;

const Label = styled(Text.M)`
  padding: 0 8px;
`;

RadioButtonCard.Variant = RadioButtonVariant;
export default RadioButtonCard;
