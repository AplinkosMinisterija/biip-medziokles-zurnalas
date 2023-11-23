import {routes} from '@containers/Router';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {getActiveHuntingsToday} from '@root/state/huntings/huntingsSelectors';
import {hasNotch, isIOS} from '@utils/layout';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {strings} from '../strings';
import {tabBarBackground} from './../assets';
import {theme} from './../theme';
import EventsIcon from './svg/Events';
import HuntingIcon from './svg/Hunting';
import StatisticsIcon from './svg/Statistics';
import Text from './Text';

const getTabColor = (active?: boolean, special?: boolean) => {
  return active
    ? theme.colors.secondary
    : special
    ? theme.colors.primaryLight
    : theme.colors.primary;
};
const CustomTabBar = ({state, navigation}: BottomTabBarProps) => {
  const activeEvents = useSelector(getActiveHuntingsToday());
  const [eventsRoute, activeHuntRoute, limitsRoute] = state.routes;
  const eventsRouteIndex = 0;
  const activeHuntRouteIndex = 1;
  const limitsRouteIndex = 2;

  const eventsRouteIsActive = state.index === eventsRouteIndex;
  const activeHuntRouteIsActive = state.index === activeHuntRouteIndex;
  const limitsRouteIsActive = state.index === limitsRouteIndex;

  const onNavigate = (route: any, index: number, params?: any) => {
    const isFocused = state.index === index;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({name: route.name, params, merge: true});
    }
  };

  const handleActiveEvent = () => {
    if (activeEvents) {
      if (activeEvents.length > 1) {
        navigation.navigate(routes.activeHuntsDialog, {
          activeHunts: activeEvents,
        });
      } else {
        onNavigate(activeHuntRoute, activeHuntRouteIndex, {
          huntingId: activeEvents[0].id,
        });
      }
    } else {
      navigation.navigate(routes.huntingDialog, {
        title: strings.errors.noActiveHunting.title,
        message: strings.errors.noActiveHunting.subtitle,
      });
    }
  };

  return (
    <Container>
      <Background source={tabBarBackground} />
      <Menu>
        <Tab
          hitSlop={{top: -20}}
          onPress={() => onNavigate(eventsRoute, eventsRouteIndex)}
        >
          <EventsIcon color={getTabColor(eventsRouteIsActive)} />
          <Label isActive={eventsRouteIsActive} weight={Text.Weight.medium}>
            {strings.tabs.events}
          </Label>
        </Tab>
        <SpecialTab>
          <Circle
            isActive={activeHuntRouteIsActive}
            enabled={!!activeEvents}
            onPress={handleActiveEvent}
          >
            <HuntingIcon
              color={
                activeHuntRouteIsActive || !!activeEvents
                  ? 'white'
                  : theme.colors.primaryLight
              }
            />
          </Circle>
          {activeEvents ? (
            <SpecialTabLabelWrapper onPress={handleActiveEvent}>
              <Label
                isActive={activeHuntRouteIsActive}
                weight={Text.Weight.medium}
              >
                {strings.activeEvent}
              </Label>
            </SpecialTabLabelWrapper>
          ) : (
            <Label
              isActive={activeHuntRouteIsActive}
              weight={Text.Weight.medium}
            >
              {''}
            </Label>
          )}
        </SpecialTab>
        <Tab
          hitSlop={{top: -20}}
          onPress={() => onNavigate(limitsRoute, limitsRouteIndex)}
        >
          <StatisticsIcon color={getTabColor(limitsRouteIsActive)} />
          <Label isActive={limitsRouteIsActive} weight={Text.Weight.medium}>
            {strings.tabs.limits}
          </Label>
        </Tab>
      </Menu>
    </Container>
  );
};

const Container = styled(View)`
  background-color: transparent;
  position: absolute;
  height: 115px;
  width: 100%;
  bottom: ${isIOS && hasNotch ? '-5px' : '-20px'};
`;

const Background = styled(Image)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 115px;
`;

const Menu = styled(View)`
  position: absolute;
  flex-direction: row;
`;

const Tab = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 25px;
  height: 115px;
`;

const SpecialTabLabelWrapper = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

const SpecialTab = styled(View)`
  align-items: center;
  justify-content: space-between;
  height: 115px;
  padding-bottom: 25px;
`;

const Circle = styled(TouchableOpacity)<{isActive: boolean; enabled: boolean}>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${({theme, isActive, enabled}) =>
    isActive
      ? theme.colors.secondary
      : enabled
      ? theme.colors.primaryLight
      : theme.colors.white};
  justify-content: center;
  align-items: center;
  margin-right: 2px;
  ${({theme}) => theme.shadow.ultraLight}
`;

const Label = styled(Text.S)<{isActive: boolean}>`
  text-align: center;
  margin: 4px 0 4px 0;
  color: ${({theme, isActive}) =>
    isActive ? theme.colors.secondary : theme.colors.primary};
`;

export default CustomTabBar;
