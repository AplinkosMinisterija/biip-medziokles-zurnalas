import {useIsFocused} from '@react-navigation/native';
import CustomSwitch from '@root/components/CustomSwitch';
import HorizontalTabs, {
  HorizontalTabRoute,
} from '@root/components/HorizontalTabs';
import {Padding, Row} from '@root/components/layout';
import Text from '@root/components/Text';
import {appActions} from '@root/state/app/actions';
import {
  getIsMyHuntingEventsFilter,
  getSelectedHuntingArea,
} from '@root/state/app/appSelectors';
import {dataActions} from '@root/state/data/actions';
import {getMe} from '@root/state/data/dataSelectors';
import {
  getActiveHuntingsToday,
  getHuntingHistoryNoSections,
} from '@root/state/huntings/huntingsSelectors';
import {notificationsActions} from '@root/state/notifications/actions';
import {notificationsSelectors} from '@root/state/notifications/notificationSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {EventCategory} from '@root/state/types';
import {getMyTenantUser} from '@state/tenantUsers/tenantUsersSelectors';
import {isIOS} from '@utils/layout';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/Button';
import Header from '../../components/Header';
import {strings} from '../../strings';
import {routes} from '../Router';
import EventsList from './EventsList';
import {useInfiniteHuntEvents} from './queries';

const optionRoutes: HorizontalTabRoute<EventCategory>[] = [
  {key: EventCategory.today, title: 'Šiandien'},
  {key: EventCategory.future, title: 'Suplanuotos'},
  {key: EventCategory.past, title: 'Istorinės '},
];

const Events = (props: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [selectedEventCategory, setSelectedEventCategory] = useState(
    optionRoutes[0],
  );
  const selectedArea = useSelector(getSelectedHuntingArea);
  const onSync = useSelector(getOnSync.data);
  const activeHuntings = useSelector(getActiveHuntingsToday());
  const showMyHuntingEventsOnly = useSelector(getIsMyHuntingEventsFilter);
  const myId = useSelector(getMe);
  const myTenantUser = useSelector(getMyTenantUser);
  const iCanManageHuntings = myTenantUser?.permissions.huntingManager;

  const huntingsFromState = useSelector(getHuntingHistoryNoSections);

  const eventsPastQuery = useInfiniteHuntEvents({
    scope: EventCategory.past,
    my: showMyHuntingEventsOnly,
    huntingAreaId: selectedArea,
    sort: '-startDate',
  });

  const eventsFutureQuery = useInfiniteHuntEvents({
    scope: EventCategory.future,
    my: showMyHuntingEventsOnly,
    huntingAreaId: selectedArea,
    sort: 'startDate',
  });

  const getNotificationPermissionAsked: boolean = useSelector(
    notificationsSelectors.getNotificationPermissionAsked,
  );

  useEffect(() => {
    getData();
    isIOS
      ? dispatch(notificationsActions.initNotifications())
      : handleNotificationPermission();
  }, []);

  useEffect(() => {
    if (selectedEventCategory.key === EventCategory.future) {
      eventsFutureQuery.refetch();
    }
    if (selectedEventCategory.key === EventCategory.past) {
      eventsPastQuery.refetch();
    }
  }, [isFocused, selectedEventCategory.key]);

  const handleNotificationPermission = () => {
    if (!getNotificationPermissionAsked) {
      checkNotifications().then(({status}) => {
        if (status === 'denied') {
          requestNotifications(['alert', 'sound']).then(res => {
            if (res.status === 'blocked') {
              dispatch(appActions.setNotificationPermissionAsked());
            } else if (res.status === 'granted') {
              dispatch(notificationsActions.initNotifications());
              dispatch(appActions.setNotificationPermissionAsked());
            }
          });
        }
      });
    }
  };

  const getData = () => {
    if (!onSync) {
      dispatch(dataActions.getMainData());
    }
  };

  const handleNewHuntingPress = () => {
    props.navigation.navigate(routes.newHunting);
  };

  const handleEventCardPress = (id: string) => {
    const foundInActive =
      activeHuntings && activeHuntings.filter(hunt => hunt?.id === id);
    if (!foundInActive || foundInActive.length === 0) {
      props.navigation.navigate(routes.huntingInner, {
        huntingId: id,
      });
    } else {
      props.navigation.navigate(routes.hunting, {
        huntingId: foundInActive[0].id,
      });
    }
  };

  const renderEventList = () => {
    switch (selectedEventCategory.key) {
      case EventCategory.today:
        return (
          <EventsList
            data={huntingsFromState}
            myId={myId}
            refreshing={onSync}
            onRefresh={getData}
            handleEventCardPress={handleEventCardPress}
          />
        );
      case EventCategory.future:
        return (
          <EventsList
            data={_.flatMap(
              eventsFutureQuery?.data?.pages ?? [],
              page => page.rows,
            )}
            myId={myId}
            // refreshing={eventsFutureQuery.isFetching}
            isFetchingNextPage={eventsFutureQuery.isFetchingNextPage}
            onRefresh={eventsFutureQuery.refetch}
            handleEventCardPress={handleEventCardPress}
            onEndReached={() =>
              !eventsFutureQuery.isFetching && eventsFutureQuery.fetchNextPage()
            }
          />
        );
      case EventCategory.past:
        return (
          <EventsList
            data={_.flatMap(
              eventsPastQuery?.data?.pages ?? [],
              page => page.rows,
            )}
            myId={myId}
            // refreshing={eventsPastQuery.isFetching}
            isFetchingNextPage={eventsPastQuery.isFetchingNextPage}
            onRefresh={eventsPastQuery.refetch}
            handleEventCardPress={handleEventCardPress}
            onEndReached={() =>
              !eventsPastQuery.isFetching && eventsPastQuery.fetchNextPage()
            }
          />
        );
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <Header {...props} />
      <>
        {!!selectedArea && (
          <TopWrapper>
            {iCanManageHuntings && (
              <SecondaryButton
                variant={Button.Variant.Secondary}
                text={strings.newHunting}
                onPress={handleNewHuntingPress}
              />
            )}
            <SwitchContainer>
              <Text.M>Mano medžioklės</Text.M>
              <Padding leftPadding={6} />
              <CustomSwitch
                onChange={() => {
                  dispatch(
                    appActions.setIsMyHuntingsEventFilter(
                      !showMyHuntingEventsOnly,
                    ),
                  );
                }}
                value={showMyHuntingEventsOnly}
              />
            </SwitchContainer>
          </TopWrapper>
        )}
        <Padding topPadding={16} />
        <HorizontalTabs
          selected={selectedEventCategory}
          onSelect={tab => setSelectedEventCategory(tab)}
          routes={optionRoutes}
        />
      </>
      {renderEventList()}
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const SecondaryButton = styled(Button)`
  width: 45%;
`;

const SwitchContainer = styled(Row)`
  align-items: center;
  justify-content: flex-end;
`;

const TopWrapper = styled(Row)`
  margin-top: 16px;
  margin-horizontal: 16px;
  align-items: center;
  justify-content: space-between;
`;

export default Events;
