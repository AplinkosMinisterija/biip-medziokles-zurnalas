import HeaderBack from '@components/HeaderBack';
import SearchBar from '@components/SearchBar';
import SegmentedTabbar from '@components/SegmentedTabbar';
import TargetIcon from '@components/svg/Target';
import Text from '@components/Text';
import EventCard from '@containers/Events/EventCard';
import {RootStackParamList, routes} from '@containers/Router';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import HuntingUserCard from '@root/components/HuntingUserCard';
import {getSelectedHuntingArea} from '@root/state/app/appSelectors';
import {getExtentedLimitedAnimal} from '@root/state/data/dataSelectors';
import {getHuntingsByLootData} from '@root/state/huntings/huntingsSelectors';
import {
  ExtendedLimitedAnimalData,
  UserWithLootsAndHuntingData,
} from '@root/state/types';
import {getUsersByLimitedAnimal} from '@root/state/users/usersSelectors';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {isIOS} from '@utils/layout';
import Fuse from 'fuse.js';
import {isEmpty, map, sumBy} from 'lodash';
import React, {useMemo, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

type AnimalStatisticsRouteProp = RouteProp<
  RootStackParamList,
  routes.animalStatistics
>;

interface Props {
  route: AnimalStatisticsRouteProp;
}

const AnimalStatistics: React.FC<Props> = ({
  route: {
    params: {limitedAnimalId, selectedSeason},
  },
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const limitedAnimal: ExtendedLimitedAnimalData = useSelector(
    getExtentedLimitedAnimal(limitedAnimalId),
  );
  const huntingAreaId: string | null = useSelector(getSelectedHuntingArea);
  const huntersWithLoot = useSelector(
    getUsersByLimitedAnimal(limitedAnimalId, selectedSeason.id, huntingAreaId),
  );
  const huntingsWithLoot = useSelector(
    getHuntingsByLootData(limitedAnimalId, selectedSeason.id, huntingAreaId),
  );

  const totalLoot = useMemo(
    () => sumBy(huntersWithLoot, item => item.lootCount),
    [huntersWithLoot],
  );

  const [searchString, setSearchString] = useState<string | null>();

  const [filterByHunter, setFilterByHunter] = useState(true);

  const optionRoutes = [
    {key: true, title: strings.members},
    {key: false, title: strings.huntings},
  ];

  const fusedList = useMemo(() => {
    return new Fuse(huntersWithLoot, {
      includeScore: true,
      keys: [
        {
          name: 'firstName',
          getFn: (user: UserWithLootsAndHuntingData) => user.userData.firstName,
        },
        {
          name: 'lastName',
          getFn: (user: UserWithLootsAndHuntingData) => user.userData.lastName,
        },
      ],
    });
  }, [huntersWithLoot]);

  const filteredHunters = useMemo(() => {
    if (!searchString) {
      return huntersWithLoot;
    }
    return fusedList
      .search({
        $or: [{firstName: searchString}, {lastName: searchString}],
      })
      .map(({item}) => item);
  }, [fusedList, searchString, huntersWithLoot]);

  const categories = isEmpty(limitedAnimal.categories)
    ? ''
    : ` (${map(limitedAnimal.categories, ac => strings[ac]).join()})`;

  const title = limitedAnimal.animal.name + categories;

  return (
    <Container>
      <HeaderBack title={title} />
      <ScrollView>
        <FilterOptions
          routes={optionRoutes}
          onSelect={val => setFilterByHunter(Boolean(val))}
        />

        <Content behavior={isIOS ? 'padding' : 'height'}>
          {filterByHunter && (
            <SearchBar
              onSearch={setSearchString}
              triggerClear={isEmpty(searchString)}
            />
          )}
          <LootInfoItem>
            <TargetIcon size={16} color={theme.colors.primaryDark} />
            <Label variant={Text.Variant.primaryDark}>{totalLoot}</Label>
          </LootInfoItem>
          {filterByHunter
            ? filteredHunters.map(hunter => (
                <HuntingUserCard
                  key={hunter.userData.id}
                  onPress={() => {
                    navigation.navigate(routes.usersHuntingList, {
                      animal: limitedAnimal.animal,
                      user: hunter.userData,
                      huntings: hunter.huntings,
                    });
                  }}
                  user={hunter.userData}
                  lootsCount={hunter.lootCount}
                />
              ))
            : huntingsWithLoot.map(({hunting}) => (
                <EventCard
                  id={hunting.id}
                  key={hunting.id}
                  onPress={() => {
                    navigation.navigate(routes.huntingInner, {
                      huntingId: hunting.id,
                    });
                  }}
                  organizer={hunting.managerData.user}
                  date={new Date(hunting?.startDate)}
                  endDate={hunting?.endDate ? new Date(hunting.endDate) : null}
                  loot={hunting.lootCount}
                  status={hunting?.status}
                  huntingArea={hunting.huntingAreaData?.name || ''}
                />
              ))}
        </Content>
      </ScrollView>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Content = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const FilterOptions = styled(SegmentedTabbar)`
  margin: 16px 16px 12px 16px;
`;

const LootInfoItem = styled(View)`
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  margin: 0px 16px;
`;

const Label = styled(Text.M)`
  margin-left: 2px;
`;

export default AnimalStatistics;
