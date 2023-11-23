import Text, {TextParam} from '@components/Text';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import {Column, Padding} from './layout';
import RightIcon from './svg/Right';

type ButtonRightCardProps = {
  onPress: () => void;
  label: string;
  info?: string;
  variant?: string;
  style?: any;
  disabled?: boolean;
  labelProps?: TextParam;
  infoProps?: TextParam;
};

const ButtonRight = ({
  label,
  info,
  onPress,
  variant,
  style,
  disabled = false,
  infoProps,
  labelProps,
}: ButtonRightCardProps) => {
  return (
    <TouchableCard onPress={onPress} style={style} disabled={disabled}>
      <Row>
        <Column>
          <Text.M
            variant={
              variant === 'light'
                ? Text.Variant.light
                : Text.Variant.primaryDark
            }
            {...labelProps}
          >
            {label}
          </Text.M>
          {!!info && (
            <Padding topPadding={3}>
              <Text.S
                numberOfLines={1}
                variant={
                  variant === 'light'
                    ? Text.Variant.secondary
                    : Text.Variant.primaryDark
                }
                {...infoProps}
              >
                {info}
              </Text.S>
            </Padding>
          )}
        </Column>
        <RightIcon
          color={variant === 'light' ? 'white' : theme.colors.primary}
        />
      </Row>
    </TouchableCard>
  );
};

const TouchableCard = styled(TouchableOpacity)<{disabled: boolean}>`
  width: 100%;
  padding: 16px 24px;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default ButtonRight;
