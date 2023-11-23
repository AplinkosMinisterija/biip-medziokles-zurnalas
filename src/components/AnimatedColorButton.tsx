import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import Text from '../components/Text';
import {theme} from '../theme';
import RightIcon from './svg/Right';

interface Props {
  onPress: () => void;
  label: string;
  info?: string;
  variant?: string;
  style?: any;
  disabled?: boolean;
  color1?: string;
  color2?: string;
  showRightIcon?: boolean;
}

const AnimatedColorButton: React.FC<Props> = ({
  label,
  info,
  onPress,
  variant,
  style,
  disabled = false,
  color1 = theme.colors.secondary,
  color2 = theme.colors.white,
  showRightIcon = true,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1000, easing: Easing.sin}),
      -1,
      true,
    );
  }, []);

  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0.2, 0.8],
      [color1, color2],
    );

    return {backgroundColor};
  });
  return (
    <TouchableCard onPress={onPress} disabled={disabled}>
      <Container style={[style, rStyle]}>
        <Row setCenter={!showRightIcon}>
          <Text.M
            variant={
              variant === 'light'
                ? Text.Variant.light
                : Text.Variant.primaryDark
            }
          >
            {label}
          </Text.M>
          {showRightIcon && (
            <RightIcon
              color={variant === 'light' ? 'white' : theme.colors.primary}
            />
          )}
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
      </Container>
    </TouchableCard>
  );
};

const Container = styled(Animated.View)`
  padding: 16px 24px;
`;

const TouchableCard = styled(TouchableOpacity)<{disabled: boolean}>`
  width: 100%;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const Row = styled(View)<{setCenter: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({setCenter}) => (setCenter ? 'center' : 'space-between')};
`;

export default AnimatedColorButton;
