import Text from '@components/Text';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button, {ButtonVariant} from '@root/components/Button';
import TargetIcon from '@root/components/svg/Target';
import {RootStackParamList, routes} from '@root/containers/Router';
import {theme} from '@root/theme';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import ObservationInformation from './ObservationInformation';

type ObservationRouteProp = RouteProp<
  RootStackParamList,
  routes.footPrintObservation
>;

const FootPrintObservationScreen = () => {
  const route: ObservationRouteProp = useRoute();
  const {observationId} = route.params;
  const navigation = useNavigation();

  return (
    <Wrapper>
      <ObservationInformation
        status="Created"
        startDate="2023-11-02 12:30"
        endDate={null}
      />
      <Container>
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
            <TargetIcon size={16} color={theme.colors.primaryDark} />
            <Text.M variant={Text.Variant.primaryDark}> 23 </Text.M>
          </InfoItem>
        </Row>
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

export default FootPrintObservationScreen;
