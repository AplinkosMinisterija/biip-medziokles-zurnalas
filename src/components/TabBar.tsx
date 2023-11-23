import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {strings} from '../strings';
import {theme} from '../theme';
import EventsIcon from './svg/Events';
import HuntingIcon from './svg/Hunting';
import SettingsIcon from './svg/Settings';

const Icons: any = {
  events: EventsIcon,
  hunting: HuntingIcon,
  settings: SettingsIcon,
};

const TabBar = ({state, descriptors, navigation}: any) => {
  return (
    <Container>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = strings.tabs[route.name];
        const Icon = Icons[route.name];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Tab key={route.key}>
            <InnerTab
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <Icon
                color={
                  isFocused ? theme.colors.primaryDark : theme.colors.primary
                }
              />
              <Label isSelected={isFocused}>{label}</Label>
            </InnerTab>
          </Tab>
        );
      })}
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  background-color: white;
`;

const Tab = styled(View)`
  flex: 1;
  background-color: white;
`;

const InnerTab = styled(TouchableOpacity)`
  align-items: center;
  padding: 10px 0 24px 0;
`;

const Label = styled(Text)<{isSelected: boolean}>`
  color: ${({theme, isSelected}) =>
    isSelected ? theme.colors.primaryDark : theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
`;

export default TabBar;
