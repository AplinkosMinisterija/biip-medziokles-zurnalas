import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import CloseIcon from './svg/Close';

type CloseButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
  size?: number;
};

const CloseButton = ({onPress, style, color, size}: CloseButtonProps) => {
  return (
    <CloseIconButton style={style} onPress={onPress} hitSlop={theme.hitSlop}>
      <CloseIcon color={color} size={size} />
    </CloseIconButton>
  );
};

const CloseIconButton = styled(TouchableOpacity)`
  width: 20px;
  align-items: center;
  justify-content: center;
  height: 20px;
`;

export default CloseButton;
