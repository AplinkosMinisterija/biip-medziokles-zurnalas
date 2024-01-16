import BackButton from '@components/BackButton';
import Button from '@components/Button';
import Text from '@components/Text';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import styled from 'styled-components';

interface Props {
  huntingAreaName: string;
  startDate: string;
  endDate: string;
  trail: string;
  endDateText?: string;
  actionButtonText: string;
  onActionButtonPress?: () => void;
}

const ObservationInformation: React.FC<Props> = ({
  startDate,
  endDate,
  endDateText,
  huntingAreaName,
  actionButtonText,
  onActionButtonPress,
  trail,
}) => {
  const navigation = useNavigation();

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Header>
        <BackButton onPress={() => navigation.goBack()} />
        <>
          {onActionButtonPress ? (
            <ActionButton
              variant={Button.Variant.Secondary}
              text={actionButtonText}
              onPress={onActionButtonPress}
              loading={false}
              disabled={false}
            />
          ) : (
            <Text.L>{actionButtonText}</Text.L>
          )}
        </>
      </Header>
      <InfoContainer>
        <Column>
          <Text.M variant={Text.Variant.secondary} weight={Text.Weight.medium}>
            {`${huntingAreaName}`}
          </Text.M>
          <DatesContainer>
            <Row>
              <Dot />
              <EventTime variant={Text.Variant.light}>{startDate}</EventTime>
            </Row>
            <View>
              <MiniDot />
              <MiniDot middle={true} />
              <MiniDot />
            </View>
            <Row>
              <Dot />
              <EventTime variant={Text.Variant.light}>
                {endDate ?? endDateText}
              </EventTime>
            </Row>
          </DatesContainer>
          <Text.M variant={Text.Variant.light}>{`Maršrutas: ${trail}`}</Text.M>
        </Column>
      </InfoContainer>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colors.primaryDark};
  padding-top: ${({theme}) => `${theme.header}px`};
`;

const InfoContainer = styled(View)`
  padding: 16px;
  padding-top: 0;
  flex-direction: row;
`;

const EventTime = styled(Text.M)`
  line-height: 18px;
  vertical-align: middle;
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  height: 18px;
`;

const Column = styled(View)`
  padding: 0 0 0 12px;
  justify-content: space-between;
  flex: 1;
`;

const Header = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
  padding-bottom: 18px;
  background-color: ${({theme}) => theme.colors.primaryDark};
`;

const ActionButton = styled(Button)`
  width: 60%;
`;

const Dot = styled(View)`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  border: 2px solid white;
  margin: 0 8px 0 0;
  opacity: 0.6;
`;

const MiniDot = styled(View)<{middle?: boolean}>`
  height: 2px;
  width: 2px;
  border-radius: 2px;
  background-color: white;
  margin: ${({middle}) => (middle ? '2px 4px' : '0 4px')};
  opacity: 0.6;
`;

const DatesContainer = styled(View)`
  margin-bottom: 8px;
  margin-top: 8px;
`;

export default ObservationInformation;
