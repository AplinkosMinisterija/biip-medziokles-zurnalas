import Text from '@components/Text';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {api} from '@root/apis/api';
import Button, {ButtonVariant} from '@root/components/Button';
import EmptyState from '@root/components/EmptyState';
import FootprintIcon from '@root/components/svg/Footprint';
import {RootStackParamList, routes} from '@root/containers/Router';
import {FootprintObservationStatus} from '@root/state/types';
import {theme} from '@root/theme';
import {formatDateTimeLT} from '@root/utils/time';
import {useMutation} from '@tanstack/react-query';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import ObservationInformation from './ObservationInformation';

type ObservationRouteProp = RouteProp<
  RootStackParamList,
  routes.footPrintObservation
>;

const FootprintObservationScreen = () => {
  const route: ObservationRouteProp = useRoute();
  const {footprint} = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const startObservation = useMutation({
    mutationFn: () => {
      return api.startFootprintObservation(footprint.id);
    },
  });

  const StatusConfig: {
    [key in string]: {
      endDateText?: string;
      actionButtonText: string;
      onActionButtonPress?: () => void;
    };
  } = {
    [FootprintObservationStatus.PLANNED]: {
      endDateText: 'neprasidėjęs stebėjimas',
      actionButtonText: 'Pradėti stebėjimą',
      onActionButtonPress: () => {
        navigation.navigate(routes.startObservationModal, {
          observationId: footprint.id,
        });
        // console.tron.log('click');
        // startObservation.mutate();
      },
    },
    [FootprintObservationStatus.STARTED]: {
      endDateText: 'Pradėti stebėjimą',
      actionButtonText: 'Baigti stebėjimą',
      onActionButtonPress: () => {},
    },
    [FootprintObservationStatus.ENDED]: {
      actionButtonText: 'Stebėjimas pabaiktas',
    },
  };

  const eventTime = footprint.startedAt ?? footprint.eventTime;
  const eventStartTime = eventTime ? formatDateTimeLT(eventTime) : '-';
  const trail = footprint.footprintTrack;
  const eventEndTime = footprint.endedAt
    ? formatDateTimeLT(footprint.endedAt)
    : StatusConfig[footprint.status].endDateText || '';

  return (
    <Wrapper>
      <ObservationInformation
        startDate={eventStartTime}
        endDate={eventEndTime}
        huntingAreaName={footprint.huntingArea.name}
        trail={`#${trail.marsrutoNr} ${trail.savivalda} ${trail.ilgisKm}km`}
        {...StatusConfig[footprint.status]}
      />
      <Container>
        {footprint.status === FootprintObservationStatus.PLANNED ? (
          <EmptyState title="Stebėjimas neprasidėjęs" />
        ) : (
          <Row>
            <Button
              text="Laba"
              variant={ButtonVariant.Primary}
              onPress={() => {
                navigation.navigate(routes.footPrintRecordWizard);
              }}
              width={'90%'}
            />
            <InfoItem>
              <FootprintIcon size={16} color={theme.colors.primaryDark} />
              <Text.M variant={Text.Variant.primaryDark}>
                {footprint.recordsCount}
              </Text.M>
            </InfoItem>
          </Row>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.almostWhite};
`;

const Container = styled(View)`
  flex: 1;
  padding: 16px;
  padding-top: 8px;
`;

const InfoItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: auto;
`;

const Row = styled(View)`
  flex-direction: row;
  min-height: 40px;
`;

export default FootprintObservationScreen;
