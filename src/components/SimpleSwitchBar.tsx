import React from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import styled from 'styled-components';
import Text from './Text';

type Route<T> = {
  key: T;
  title: string;
};

type Props<T> = {
  routes: Route<T>[];
  label?: string;
  onSelect: (val: T) => void;
  style?: ViewStyle;
  selectedKey: T;
};

const SimpleSwitchBar = function <T = string>({
  routes,
  onSelect,
  label,
  style,
  selectedKey,
}: Props<T>) {
  return (
    <Wrapper style={style}>
      {label && <Name variant={Text.Variant.primaryDark}>{label}</Name>}
      <TabsContainer>
        {routes.map((route, i) => (
          <OptionWrapper key={i} onPress={() => onSelect(route.key)}>
            <Option selected={route.key === selectedKey}>
              <Category selected={route.key === selectedKey}>
                {route.title}
              </Category>
            </Option>
          </OptionWrapper>
        ))}
      </TabsContainer>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  background-color: transparent;
`;

const Category = styled(Text.S)<{selected: boolean}>`
  color: ${({selected}) => (selected ? 'white' : 'white')};
  text-align: center;
`;

const Name = styled(Text.M)`
  margin-bottom: 6px;
`;

const TabsContainer = styled(View)`
  background-color: #ffffff1a;
  border-radius: 8px;
  flex-direction: row;
`;

const OptionWrapper = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
`;

const Option = styled(View)<{selected: boolean}>`
  background-color: ${({selected, theme}) =>
    selected ? theme.colors.secondary : 'transparent'};
  align-items: center;
  border-radius: 8px;
  justify-content: center;
  padding: 8px;
  width: 100%;
`;

export default SimpleSwitchBar;
