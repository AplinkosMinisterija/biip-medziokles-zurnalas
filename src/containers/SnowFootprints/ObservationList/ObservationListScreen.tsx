import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {api} from '@root/apis/api';
import Button from '@root/components/Button';
import EmptyState from '@root/components/EmptyState';
import Header from '@root/components/Header';
import {RootStackParamList, routes} from '@root/containers/Router';
import {getSelectedHuntingAreaData} from '@root/state/huntingArea/huntingAreaSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {ExtendedFootprintObservation} from '@root/state/types';
import {theme} from '@root/theme';
import {useQuery} from '@tanstack/react-query';
import {isEmpty} from 'lodash';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ObservationListItem from './ObservationListItem';

const ObservationListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const selectedArea = useSelector(getSelectedHuntingAreaData);
  const onSync = useSelector(getOnSync.data);
  const [page, setPage] = useState(1);

  const {data, isFetching, refetch} = useQuery({
    queryKey: ['observations', page, selectedArea?.id],
    queryFn: () =>
      api.geFootprintObservations({huntingArea: selectedArea?.id, page}),
  });

  console.tron.log(data);
  console.tron.log(data?.rows);

  const renderListItem: ListRenderItem<ExtendedFootprintObservation> = ({
    item,
  }) => (
    <ObservationListItem
      footprint={item}
      onPress={() => {
        navigation.navigate(routes.footPrintObservation, {
          footprint: item,
        });
      }}
    />
  );

  return (
    <Container>
      <Header />
      {selectedArea && (
        <SecondaryButton
          variant={Button.Variant.Secondary}
          text={'Naujas stebėjimas'}
          onPress={() => {
            navigation.navigate(routes.footPrintWizard, {
              huntingAreaId: selectedArea.id,
              mpvId: selectedArea.mpvId,
            });
          }}
        />
      )}
      {isEmpty(data?.rows) && !onSync ? (
        <EmptyState title={'Stebėjimų nėra'} />
      ) : isEmpty(data?.rows) && onSync ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primaryDark} />
        </LoadingContainer>
      ) : (
        <StyledFlatList
          removeClippedSubviews={false}
          data={data?.rows}
          keyExtractor={(item: ExtendedFootprintObservation, index: number) =>
            `${item?.id}_${index}`
          }
          contentContainerStyle={{
            paddingBottom: 150,
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderListItem}
          onEndReached={() => {
            if (data?.page && data?.page < data?.totalPages) {
              setPage(data?.page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={onSync || isFetching}
              onRefresh={refetch}
              tintColor={theme.colors.primaryDark}
              colors={[theme.colors.primaryDark]}
            />
          }
        />
      )}
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const SecondaryButton = styled(Button)`
  margin: 16px 16px 8px 16px;
`;

const StyledFlatList = styled<any>(FlatList)`
  margin-top: 5px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default ObservationListScreen;
