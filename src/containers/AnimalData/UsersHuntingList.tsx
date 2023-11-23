import HeaderBack from '@components/HeaderBack';
import Text from '@components/Text';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Center} from '@root/components/layout';
import {StatEventData} from '@root/state/types';
import React from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import styled from 'styled-components';
import EventCard from '../Events/EventCard';
import {RootStackParamList, routes} from '../Router';

type UsersHuntingListRouteProp = RouteProp<
  RootStackParamList,
  routes.usersHuntingList
>;

interface Props {
  route: UsersHuntingListRouteProp;
}

const UsersHuntingList: React.FC<Props> = ({route}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const renderListItem: ListRenderItem<StatEventData> = ({item}) => (
    <EventCard
      id={item.id}
      key={item.id}
      onPress={() => {
        navigation.navigate(routes.huntingInner, {
          huntingId: item.id,
        });
      }}
      organizer={item.managerData.user}
      date={new Date(item?.startDate)}
      endDate={item?.endDate ? new Date(item.endDate) : null}
      loot={item.lootCount}
      status={item?.status}
      huntingArea={item.huntingAreaData?.name || ''}
    />
  );
  const renderHeader = () => (
    <Center vertical={16}>
      <Text.S>{`${route.params.user.firstName} ${route.params.user.lastName}`}</Text.S>
    </Center>
  );
  return (
    <Container>
      <HeaderBack title={route.params.animal.name} />
      <FlatList
        ListHeaderComponent={renderHeader}
        data={route.params.huntings}
        renderItem={renderListItem}
      />
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

export default UsersHuntingList;
