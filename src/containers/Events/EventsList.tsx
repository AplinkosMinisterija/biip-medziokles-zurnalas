import EmptyState from '@root/components/EmptyState';
import {getSelectedHuntingArea} from '@root/state/app/appSelectors';
import {ExtendedHuntingData} from '@root/state/data/dataSelectors';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import EventCard from './EventCard';

interface Props {
  data: ExtendedHuntingData[];
  myId: string | number;
  refreshing?: boolean;
  handleEventCardPress: (id: string) => void;
  onRefresh: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

const EventsList: React.FC<Props> = ({
  data,
  myId,
  refreshing = false,
  isFetchingNextPage = false,
  onRefresh,
  handleEventCardPress,
  onEndReached,
}) => {
  console.tron.log('refreshing', refreshing);
  const selectedArea = useSelector(getSelectedHuntingArea);
  useEffect(() => {}, [refreshing]);
  return (
    <StyledFlatList
      ListEmptyComponent={() => (
        <EmptyState title={strings.emptyState.huntingHistory} />
      )}
      ListFooterComponent={() => {
        if (isFetchingNextPage) {
          return <ActivityIndicator size={'large'} />;
        }
      }}
      removeClippedSubviews={false}
      data={data}
      keyExtractor={(item: ExtendedHuntingData, index: number) => index}
      contentContainerStyle={{
        paddingBottom: 150,
        width: '100%',
      }}
      extraData={data}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      renderItem={({item}: any) => (
        <EventCard
          id={item.id}
          onPress={() => handleEventCardPress(item?.id)}
          organizer={item?.managerUser ?? item?.manager?.user}
          date={new Date(item?.startDate)}
          endDate={item?.endDate ? new Date(item.endDate) : null}
          loot={item?.lootCount || null}
          membersCount={item?.users ? Object.keys(item?.users).length : 0}
          status={item?.status}
          showHuntingArea={!selectedArea}
          huntingArea={`| MPV #${item?.huntingArea?.mpvId || ''}`}
          isAdmin={
            item?.managerUser
              ? myId === item?.managerUser?.id
              : myId === item?.manager?.user?.id
          }
          violation={item.violation}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primaryDark}
          colors={[theme.colors.primaryDark]}
        />
      }
    />
  );
};

const StyledFlatList = styled<any>(FlatList)`
  margin-top: 5px;
`;

export default EventsList;
