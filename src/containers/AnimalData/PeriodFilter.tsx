import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import styled from 'styled-components';
import ButtonFooter from '../../components/ButtonFooter';
import HeaderClose from '../../components/HeaderClose';
import SegmentedTabbar from '../../components/SegmentedTabbar';
import Text from '../../components/Text';
import {AnimalData, SeasonData} from '../../state/types';
import {strings} from '../../strings';
import {isIOS} from '../../utils/layout';
import {formatDay} from '../../utils/time';
import {routes} from '../Router';

interface PeriodFilterInterface {
  route: {
    params: {
      animal: AnimalData;
      selectedSeason: SeasonData;
    };
  };
}

const PeriodFilter = () => {
  const route = useRoute<any>();
  const {animal, selectedSeason} = route.params;
  const navigation = useNavigation<any>();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const [filterFromDate, setFilterFromDate] = useState(true);

  const filterRoutes = [
    {key: true, title: strings.common.from},
    {key: false, title: strings.common.to},
  ];

  useEffect(() => {
    if (selectedSeason) {
      setFromDate(new Date(selectedSeason.startDate));
      setToDate(new Date(selectedSeason.endDate));
    }
  }, [selectedSeason]);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={animal.name} shadow={true} />
      <Wrapper>
        <Container>
          <FilterOptions
            routes={filterRoutes}
            onSelect={val => setFilterFromDate(Boolean(val))}
          />
          <SelectedValuesContainer>
            <ValueContainer>
              <Text.M variant={Text.Variant.primary}>
                {formatDay(fromDate)}
              </Text.M>
            </ValueContainer>
            <ValueContainer>
              <Text.M variant={Text.Variant.primary}>
                {formatDay(toDate)}
              </Text.M>
            </ValueContainer>
          </SelectedValuesContainer>
          <DatePickerWrapper>
            <DatePicker
              mode="date"
              onDateChange={value =>
                filterFromDate ? setFromDate(value) : setToDate(value)
              }
              date={filterFromDate ? fromDate : toDate}
              style={isIOS ? {flex: 1} : undefined}
              locale="lt"
            />
          </DatePickerWrapper>
        </Container>
        <ButtonFooter
          primaryButton={{
            action: () =>
              navigation.navigate(routes.animalStatistics, {
                selectedSeason,
                animalId: animal.id,
                filteredPeriod: {start: fromDate, end: toDate},
              }),
            text: strings.common.filter,
          }}
          secondaryButton={{
            action: () => {
              setFromDate(new Date(selectedSeason.startDate));
              setToDate(new Date(selectedSeason.endDate));
            },
            text: strings.common.cancel,
          }}
        />
      </Wrapper>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Wrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const DatePickerWrapper = styled(View)`
  align-items: center;
  min-height: 500px;
  justify-content: center;
`;

const ValueContainer = styled(View)`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const SelectedValuesContainer = styled(View)`
  flex-direction: row;
  margin: 0px 16px;
`;

const FilterOptions = styled(SegmentedTabbar)`
  margin: 16px 16px 10px 16px;
`;

export default PeriodFilter;
