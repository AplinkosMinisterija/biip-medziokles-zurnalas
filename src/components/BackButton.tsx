import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import BackIcon from './svg/Back';

type BackButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  iconStyle?: ViewStyle;
  color?: string;
  size?: number;
  back?: boolean;
  disabled?: boolean;
};

const BackButton = ({
  onPress,
  style,
  iconStyle,
  color,
  size,
  back,
  disabled = false,
}: BackButtonProps) => {
  return (
    <CloseIconButton
      style={style}
      onPress={() => (disabled ? null : onPress())}
      hitSlop={theme.hitSlop}
      disabled={disabled}
    >
      <BackIcon color={color} size={size} style={iconStyle} back={back} />
    </CloseIconButton>
  );
};

const CloseIconButton = styled(TouchableOpacity)<{disabled: boolean}>`
  width: 20px;
  align-items: center;
  justify-content: center;
  height: 20px;
  opacity: ${({disabled}) => (disabled ? 0.4 : 1)};
`;

export default BackButton;
