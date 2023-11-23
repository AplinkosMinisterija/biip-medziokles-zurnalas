import {dataActions} from '@root/state/data/actions';
import {
  ExtendedHuntingData,
  ExtendedLootData,
} from '@root/state/data/dataSelectors';
import {getOfflineLootsByHuntingId} from '@root/state/loots/lootsSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus} from '@root/state/types';
import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import AnimalCard from '../../components/AnimalCard';
import EmptyState from '../../components/EmptyState';
import {strings} from '../../strings';
import {theme} from '../../theme';
import AddLoot from './AddLoot';

interface HuntingLootsProps {
  huntingData: ExtendedHuntingData;
}

const HuntingLoots = ({huntingData}: HuntingLootsProps) => {
  const dispatch = useDispatch();

  const enabledLootRegistration = huntingData?.status === HuntingStatus.Started;

  const loots: ExtendedLootData[] = useSelector(
    getOfflineLootsByHuntingId(huntingData?.id),
  );

  const lootsOnSync = useSelector(getOnSync.loot);
  const dataOnSync = useSelector(getOnSync.data);

  const getData = () => {
    dispatch(dataActions.getMainData());
  };

  return (
    <Container>
      {enabledLootRegistration && <AddLoot huntingData={huntingData} />}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={lootsOnSync || dataOnSync}
            onRefresh={getData}
          />
        }
        contentContainerStyle={[
          {paddingBottom: theme.footer + 90},
          !loots?.length && {flex: 1},
        ]}
        data={loots}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            title={
              enabledLootRegistration
                ? strings.noLoots
                : strings.disabledLootRegistration
            }
          />
        }
        renderItem={({item}) => {
          return <AnimalCard lootData={item} />;
        }}
      />
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: ${() => theme.colors.almostWhite};
  padding-top: 12px;
`;

export default HuntingLoots;
