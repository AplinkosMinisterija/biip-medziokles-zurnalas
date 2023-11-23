import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import UpIcon from './svg/Up';
import Text from './Text';

type ExpandButtonProps = {
  onPress: () => void;
  label: string;
  info?: string;
  variant?: string;
  style?: any;
  expanded?: boolean;
};

const ExpandButton = ({
  label,
  info,
  onPress,
  variant,
  style,
  expanded = false,
}: ExpandButtonProps) => {
  return (
    <TouchableCard
      onPress={() => {
        onPress();
      }}
      style={style}
    >
      <Row>
        <Label
          variant={
            variant === 'light' ? Text.Variant.light : Text.Variant.primaryDark
          }
          ellipsizeMode="tail"
          textBreakStrategy="simple"
        >
          {label}
        </Label>
        <UpIcon
          color={variant === 'light' ? 'white' : theme.colors.primary}
          down={!expanded}
        />
      </Row>
      {!!info && (
        <Text.S
          numberOfLines={1}
          variant={
            variant === 'light'
              ? Text.Variant.secondary
              : Text.Variant.primaryDark
          }
        >
          {info}
        </Text.S>
      )}
    </TouchableCard>
  );
};

const TouchableCard = styled(TouchableOpacity)`
  width: 100%;
  padding: 16px 24px;
`;

const Label = styled(Text.M)`
  flex: 1;
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default ExpandButton;
