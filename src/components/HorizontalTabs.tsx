import {getWidth} from '@utils/layout';
import React, {useMemo} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components';
import Text from './Text';

export type HorizontalTabRoute<T> = {
  key: T;
  title: string;
};

type Props<T> = {
  routes: HorizontalTabRoute<T>[];
  label?: string;
  selected?: HorizontalTabRoute<T>;
  selectedKey?: T;
  onSelect: (value: HorizontalTabRoute<T>) => void;
  style?: ViewStyle;
};

const HorizontalTabs = function <T = string | boolean>({
  routes,
  selected,
  selectedKey,
  onSelect,
  label,
  style,
}: Props<T>) {
  const index = useMemo(() => {
    const idx = routes.findIndex(
      route => route.key === (selected ? selected.key : selectedKey),
    );
    return idx === -1 ? 0 : idx;
  }, [routes, selected, selectedKey]);

  const optionWidth = useMemo(
    () => (getWidth() - 32) / routes.length,
    [routes],
  );

  return (
    <Wrapper style={style}>
      {label && <Name variant={Text.Variant.primaryDark}>{label}</Name>}
      <SegmentedTabsContainer>
        <AnimatedWrapper
          style={[{width: optionWidth, left: index * optionWidth}]}
        />
        {routes.map(route => (
          <OptionWrapper key={route.title} onPress={() => onSelect(route)}>
            <Option>
              <Category
                selected={(selected ? selected.key : selectedKey) === route.key}
              >
                {route.title}
              </Category>
            </Option>
          </OptionWrapper>
        ))}
      </SegmentedTabsContainer>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  background-color: white;
  margin: 0px 16px 16px 16px;
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

export default React.memo(HorizontalTabs);
