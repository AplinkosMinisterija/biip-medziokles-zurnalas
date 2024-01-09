import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Button from '@root/components/Button';
import EmptyState from '@root/components/EmptyState';
import Header from '@root/components/Header';
import {RootStackParamList, routes} from '@root/containers/Router';
import {getSelectedHuntingAreaData} from '@root/state/huntingArea/huntingAreaSelectors';
import {getAllFootprintObservations} from '@root/state/snowFootprints/footprintSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {ExtendedFootprintObservation} from '@root/state/types';
import {theme} from '@root/theme';
import {isEmpty} from 'lodash';
import React from 'react';
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
  const observations = useSelector(getAllFootprintObservations);

  const renderListItem: ListRenderItem<ExtendedFootprintObservation> = ({
    item,
  }) => (
    <ObservationListItem
      footPrint={item}
      onPress={() => {
        navigation.navigate(routes.footPrintObservation, {
          footPrint: item,
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
      {isEmpty(observations) && !onSync ? (
        <EmptyState title={'Stebėjimų nėra'} />
      ) : isEmpty(observations) && onSync ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primaryDark} />
        </LoadingContainer>
      ) : (
        <StyledFlatList
          removeClippedSubviews={false}
          data={observations}
          keyExtractor={(item: ExtendedFootprintObservation, index: number) =>
            `${item?.id}_${index}`
          }
          contentContainerStyle={{
            paddingBottom: 150,
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderListItem}
          refreshControl={
            <RefreshControl
              refreshing={onSync}
              onRefresh={() => {
                // TODO handle pull to refresh
              }}
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
