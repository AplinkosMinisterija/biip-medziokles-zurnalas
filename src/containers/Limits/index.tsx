import AnimalLimitCard from '@components/AnimalLimitCard';
import Button from '@components/Button';
import EmptyState from '@components/EmptyState';
import Header from '@components/Header';
import PeriodPicker from '@components/PeriodPicker';
import SectionHeader from '@containers/Events/SectionHeader';
import {RootStackParamList, routes} from '@containers/Router';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {dataActions} from '@root/state/data/actions';
import {
  ExtendedHuntingAreaData,
  getCurrentSeasonData,
  getPendingLimitsByHuntingArea,
} from '@root/state/data/dataSelectors';
import {getSelectedHuntingAreaData} from '@root/state/huntingArea/huntingAreaSelectors';
import {getAvailableSeasons} from '@root/state/seasons/seasonsSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {amITenantAdminOrOwner} from '@root/state/tenantUsers/tenantUsersSelectors';
import {ExtendedLimitedAnimalData, SeasonData} from '@root/state/types';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {getLimitedAnimasStatistics} from '@state/limitedAnimals/limitedAnimalsSelectors';
import {findIndex, isEmpty} from 'lodash';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

const Limits = (props: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const onSync = useSelector(getOnSync.data);
  const isFocused = useIsFocused();

  const getData = () => {
    dispatch(dataActions.getMainData());
  };

  const huntingArea: ExtendedHuntingAreaData | undefined = useSelector(
    getSelectedHuntingAreaData,
  );

  const seasons = useSelector(getAvailableSeasons);

  const currentSeason = useSelector(getCurrentSeasonData);

  const pendingLimitRequest = useSelector(
    getPendingLimitsByHuntingArea(huntingArea?.id),
  );

  const getIndexOfSeason = (season: SeasonData) => {
    return findIndex(seasons, s => s.id === season.id);
  };

  const [selectedSeason, setSelectedSeason] = useState<SeasonData>(
    currentSeason || seasons[0],
  );

  const animalLoots: {
    limited: ExtendedLimitedAnimalData[];
    unlimited: ExtendedLimitedAnimalData[];
  } = useSelector(
    getLimitedAnimasStatistics(selectedSeason?.id, huntingArea?.id),
  );

  const data = [
    {title: 'Limituojami', data: animalLoots.limited},
    {title: 'Nelimituojami', data: animalLoots.unlimited},
  ];

  const isAdmin = useSelector(amITenantAdminOrOwner(huntingArea?.tenant?.id));

  const handleBackPress = () => {
    const selectedIndex = getIndexOfSeason(selectedSeason);
    if (selectedIndex !== 0) {
      setSelectedSeason(seasons[selectedIndex - 1]);
    }
  };

  const handleForwardPress = () => {
    const selectedIndex = getIndexOfSeason(selectedSeason);
    if (selectedIndex !== seasons.length - 1) {
      setSelectedSeason(seasons[selectedIndex + 1]);
    }
  };

  return (
    <Container>
      <Header {...props} />

      {isEmpty(seasons) && !onSync ? (
        <EmptyState title={strings.emptyState.noData} />
      ) : isEmpty(seasons) && onSync ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primaryDark} />
        </LoadingContainer>
      ) : (
        <>
          {isAdmin && (
            <PrimaryButton
              text={strings.askLimits}
              onPress={() => {
                if (pendingLimitRequest) {
                  navigation.navigate(routes.huntingDialog, {
                    title: 'Limitų prašymas yra jau išsiųstas',
                    message:
                      'Negalima sukurti naujo prašymo, kol esamas nėra patvirtinas',
                  });
                } else {
                  navigation.navigate(routes.limitsRequest);
                }
              }}
              variant={Button.Variant.Transparent}
              textVariant={Button.TextVariant.Secondary}
              disabled={currentSeason.id !== selectedSeason.id}
            />
          )}
          {!!selectedSeason && (
            <PeriodPicker
              selectedSeason={selectedSeason}
              index={getIndexOfSeason(selectedSeason)}
              count={seasons.length}
              onBackPress={handleBackPress}
              onForwardPress={handleForwardPress}
            />
          )}
          <SectionList
            sections={data}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingBottom: 150,
              width: '100%',
            }}
            renderSectionHeader={({section: {title}}) => (
              <SectionHeader>{title}</SectionHeader>
            )}
            renderItem={({item}: {item: ExtendedLimitedAnimalData}) => (
              <AnimalLimitCard
                key={item.id}
                editMode={false}
                animal={item}
                selectedSeason={selectedSeason}
                huntingAreaSelected={!!huntingArea}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isFocused && onSync}
                onRefresh={getData}
                tintColor={theme.colors.primaryDark}
                colors={[theme.colors.primaryDark]}
              />
            }
          />
        </>
      )}
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const PrimaryButton = styled(Button)`
  align-self: flex-start;
  width: 110px;
  margin-top: 16px;
  margin-left: 6px;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Limits;
