import {getWidth} from '@utils/layout';
import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components';
import Text from './Text';

type Route<T> = {
  key: T;
  title: string;
};

type SegmentedTabbarProps<T> = {
  routes: Route<T>[];
  label?: string;
  selected?: T;
  onSelect: (val: T) => void;
  style?: ViewStyle;
};

const SegmentedTabbar = function <T = string | boolean>({
  routes,
  onSelect,
  label,
  style,
}: SegmentedTabbarProps<T>) {
  const [index, setIndex] = useState(0);

  const anim = useSharedValue(index);

  const optionWidth = useMemo(
    () => (getWidth() - 32) / routes.length,
    [routes],
  );

  useEffect(() => {
    anim.value = withTiming(index * optionWidth, {duration: 250});
    onSelect(routes[index].key);
  }, [index, optionWidth]);

  const animatedSelectorStyle = useAnimatedStyle(
    () => ({
      left: anim.value,
    }),
    [],
  );

  return (
    <Wrapper style={style}>
      {label && <Name variant={Text.Variant.primaryDark}>{label}</Name>}
      <SegmentedTabsContainer>
        <AnimatedWrapper
          style={[{width: optionWidth}, animatedSelectorStyle]}
        />
        {routes.map((route, i) => (
          <OptionWrapper key={route.title} onPress={() => setIndex(i)}>
            <Option>
              <Category selected={index === i}>{route.title}</Category>
            </Option>
          </OptionWrapper>
        ))}
      </SegmentedTabsContainer>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  background-color: white;
  margin: 0px 16px 28px 16px;
`;

const Category = styled(Text.S)<{selected: boolean}>`
  color: ${({selected, theme}) => (selected ? 'white' : theme.colors.primary)};
  text-align: center;
`;

const Name = styled(Text.M)`
  margin-bottom: 6px;
`;

const SegmentedTabsContainer = styled(View)`
  background-color: #00465033;
  border-radius: 8px;
  flex-direction: row;
  position: relative;
`;

const OptionWrapper = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
`;

const Option = styled(View)`
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  padding: 8px;
`;

const AnimatedWrapper = styled(Animated.View)`
  background-color: ${({theme}) => theme.colors.primaryDark};
  border-radius: 8px;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
`;

export default SegmentedTabbar;
