import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {api} from '@root/apis/api';
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
import {useQuery} from '@tanstack/react-query';
import {isIOS} from '@utils/layout';
import React, {useCallback, useEffect, useState} from 'react';
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

  const eventsPastQuery = useQuery({
    queryKey: [
      'huntingEventsPast',
      // selectedEventCategory,
      isFocused,
      showMyHuntingEventsOnly,
      selectedArea,
    ],
    refetchOnWindowFocus: true,
    // enabled: selectedEventCategory.key === EventCategory.past,
    queryFn: () =>
      api.getHuntingEvents({
        scope: EventCategory.past,
        my: showMyHuntingEventsOnly,
        huntingAreaId: selectedArea,
        sort: '-startDate',
      }),
  });

  const eventsFutureQuery = useQuery({
    queryKey: [
      'huntingEventsFuture',
      // selectedEventCategory,
      isFocused,
      showMyHuntingEventsOnly,
      selectedArea,
    ],
    refetchOnWindowFocus: true,
    // enabled: selectedEventCategory.key === EventCategory.future,
    queryFn: () =>
      api.getHuntingEvents({
        scope: EventCategory.future,
        my: showMyHuntingEventsOnly,
        huntingAreaId: selectedArea,
        sort: 'startDate',
      }),
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

  useFocusEffect(
    useCallback(() => {
      console.tron.log('useFocusEffect!!!!!');
      eventsPastQuery.refetch();
      eventsFutureQuery.refetch();
    }, []),
  );

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
            data={eventsFutureQuery.data?.data?.rows}
            myId={myId}
            refreshing={eventsFutureQuery.isLoading}
            onRefresh={eventsFutureQuery.refetch}
            handleEventCardPress={handleEventCardPress}
          />
        );
      case EventCategory.past:
        return (
          <EventsList
            data={eventsPastQuery.data?.data?.rows}
            myId={myId}
            refreshing={eventsPastQuery.isLoading}
            onRefresh={eventsPastQuery.refetch}
            handleEventCardPress={handleEventCardPress}
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
