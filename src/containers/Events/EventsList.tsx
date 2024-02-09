import {useIsFocused} from '@react-navigation/native';
import EmptyState from '@root/components/EmptyState';
import {getSelectedHuntingArea} from '@root/state/app/appSelectors';
import {ExtendedHuntingData} from '@root/state/data/dataSelectors';
import {strings} from '@root/strings';
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
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
  const selectedArea = useSelector(getSelectedHuntingArea);
  const isFocused = useIsFocused();

  return (
    <FlashList
      estimatedItemSize={129}
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
      keyExtractor={(item: ExtendedHuntingData) => item.id}
      contentContainerStyle={{
        paddingBottom: 150,
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
      refreshing={isFocused && refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default EventsList;
