import {getSelectedHuntingArea} from '@root/state/app/appSelectors';
import {getCurrentSeason} from '@root/state/seasons/seasonsSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {limitActions} from '@state/limitedAnimals/actions';
import {getLimitedAnimasStatistics} from '@state/limitedAnimals/limitedAnimalsSelectors';
import {ExtendedLimitedAnimalData, LimitType} from '@state/types';
import {goBack} from '@utils/navigation';
import {format} from 'date-fns';
import {filter, isEmpty, keys, map} from 'lodash';
import React, {useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import AnimalLimitCard from '../../components/AnimalLimitCard';
import ButtonFooter from '../../components/ButtonFooter';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import {strings} from '../../strings';

const LimitsRequest = () => {
  const dispatch = useDispatch();
  const huntingArea = useSelector(getSelectedHuntingArea) || '';
  const isLimitsSync = useSelector(getOnSync.limits);
  const season = useSelector(getCurrentSeason);

  const animalLoots: {
    limited: ExtendedLimitedAnimalData[];
    unlimited: ExtendedLimitedAnimalData[];
  } = useSelector(getLimitedAnimasStatistics(season?.id, huntingArea));

  const filteredList: ExtendedLimitedAnimalData[] = filter(
    animalLoots.limited,
    al => al.type !== LimitType.global,
  );

  const [requestedLimits, setRequestedLimits] = useState<{
    [kei: string]: number;
  }>({});

  const mappedList: ExtendedLimitedAnimalData[] = map(filteredList, al => {
    const newPending = requestedLimits[al.id];
    if (newPending) {
      return {
        ...al,
        stats: {
          ...al.stats,
          pending: newPending,
        },
      };
    }
    return al;
  });

  const handleRequestLimit = (id: string, amount: number) => {
    setRequestedLimits({
      ...requestedLimits,
      [id]: amount,
    });
  };

  return (
    <Container>
      <HeaderBack title={strings.limitsRequest} />
      <Content enableOnAndroid={true}>
        <Label variant={Text.Variant.primary}>{`SEZONAS ${format(
          new Date(season?.startDate),
          'yyyy',
        )}/${format(new Date(season?.endDate), 'yyyy')}`}</Label>
        {map(mappedList, item => (
          <AnimalLimitCard
            key={item.id}
            editMode={true}
            animal={item}
            onChange={val => handleRequestLimit(item.id, Number(val))}
            huntingAreaSelected={!!huntingArea}
          />
        ))}
      </Content>
      <StyledButtonFooter
        primaryButton={{
          action: () => {
            if (keys(requestedLimits).length > 0) {
              const requests: {
                limitedAnimal: string;
                amount: string;
              }[] = map(mappedList, item => {
                return {
                  limitedAnimal: item.id,
                  amount: (item.stats?.pending || 0).toString(),
                };
              });
              dispatch(
                limitActions.requestLimits({
                  huntingArea,
                  requests,
                }),
              );
            }
          },
          text: strings.common.ask,
          disabled: isEmpty(requestedLimits),
          loading: isLimitsSync,
        }}
        secondaryButton={{
          action: goBack,
          text: strings.common.cancel,
          disabled: false,
        }}
      />
    </Container>
  );
};

const Content = styled(KeyboardAwareScrollView)`
  flex: 1;
`;

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const StyledButtonFooter = styled(ButtonFooter)`
  position: absolute;
  bottom: 0;
`;

const Label = styled(Text.S)`
  margin: 24px 16px;
  text-align: center;
`;

export default LimitsRequest;
