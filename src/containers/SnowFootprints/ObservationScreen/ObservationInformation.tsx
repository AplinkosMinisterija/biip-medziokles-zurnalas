import BackButton from '@components/BackButton';
import Button from '@components/Button';
import Text from '@components/Text';
import {useNavigation} from '@react-navigation/native';
import {theme} from '@root/theme';
import {convertStringToDate} from '@utils/time';
import {format, getYear} from 'date-fns';
import {lt} from 'date-fns/locale';
import React from 'react';
import {StatusBar, View} from 'react-native';
import styled from 'styled-components';

//TODO change this to real status
const StatusConfig: {
  [key in string]: {color: string; text: string};
} = {
  ['Ended']: {
    color: theme.colors.primary,
    text: 'Stebėjimas pabaiktas',
  },
  ['Started']: {
    color: theme.colors.primaryDark,
    text: 'vyksta dabar',
  },
  ['Created']: {
    color: theme.colors.primaryUltraLight,
    text: 'neprasidėjęs stebėjimas',
  },
};

interface Props {
  extraHeader?: React.ReactElement;
  huntingAreaName: string;
  startDate: string;
  endDate: string;
  trail: string;
  status: string;
}

const ObservationInformation: React.FC<Props> = ({
  startDate,
  endDate,
  status,
  huntingAreaName,
}) => {
  const navigation = useNavigation();
  const startDateObj = convertStringToDate(startDate);
  const endDateObj = endDate ? convertStringToDate(endDate) : null;

  const eventTime =
    format(startDateObj, 'HH:mm MMMM d', {locale: lt}) +
    'd. ' +
    getYear(startDateObj);

  const eventEndTime = endDateObj
    ? format(endDateObj, 'HH:mm MMMM d', {locale: lt}) +
      'd. ' +
      getYear(endDateObj)
    : StatusConfig[status].text || '';

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Header>
        <BackButton onPress={() => navigation.goBack()} />
        <>
          <StartButton
            variant={Button.Variant.Secondary}
            text={'Action.label'}
            onPress={() => {}}
            loading={false}
            disabled={false}
          />
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
              <EventTime variant={Text.Variant.light}>{eventTime}</EventTime>
            </Row>
            <View>
              <MiniDot />
              <MiniDot middle={true} />
              <MiniDot />
            </View>
            <Row>
              <Dot />
              <EventTime variant={Text.Variant.light}>{eventEndTime}</EventTime>
            </Row>
          </DatesContainer>
        </Column>
      </InfoContainer>
    </Container>
  );
};

const Container = styled(View)`
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

const StartButton = styled(Button)`
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
