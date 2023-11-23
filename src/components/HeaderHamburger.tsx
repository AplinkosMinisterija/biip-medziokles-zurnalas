import {theme} from '@root/theme';
import React, {useEffect} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import Hamburger from './svg/Hamburger';

interface Props {
  showBadge?: boolean;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const HeaderHamburger: React.FC<Props> = ({
  showBadge = false,
  onPress,
  color,
  style,
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
      [theme.colors.secondary, theme.colors.primary],
    );

    return {backgroundColor};
  });
  return (
    <Container style={style} onPress={onPress}>
      <Wrapper>
        <Hamburger color={color} />
        {showBadge && <Badge style={rStyle} />}
      </Wrapper>
    </Container>
  );
};

export default HeaderHamburger;

const Container = styled(TouchableOpacity)`
  justify-content: center;
`;

const Wrapper = styled(View)`
  width: 24px;
  height: 24px;
`;

const Badge = styled(Animated.View)`
  height: 14px;
  width: 14px;
  border-radius: 7px;
  position: absolute;
  right: -1px;
  top: -1px;
  justify-content: center;
  align-items: center;
`;
