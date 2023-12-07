import {HuntingStatus} from '@root/state/types';
import {ExtendedHuntingData} from '@state/data/dataSelectors';
import {convertStringToDate} from '@utils/time';
import {format, getYear} from 'date-fns';
import {lt} from 'date-fns/locale';
import React, {useState} from 'react';
import {SafeAreaView, StatusBar, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import DotsVerticalIcon from '../../components/svg/DotsVertical';
import Text from '../../components/Text';
import {strings} from '../../strings';
import {theme} from '../../theme';

const StatusConfig: {
  [key in string]: {color: string; text: string};
} = {
  [HuntingStatus.Ready]: {
    color: theme.colors.primary,
    text: strings.huntingStatus.registrationStarted,
  },
  [HuntingStatus.Started]: {
    color: theme.colors.primaryDark,
    text: strings.huntingStatus.huntingStarted,
  },
  [HuntingStatus.Created]: {
    color: theme.colors.primaryUltraLight,
    text: strings.huntingStatus.notStarted,
  },
};

interface HuntingInformationProps {
  huntingData: ExtendedHuntingData;
  extraHeader?: React.ReactElement;
  onOpenMore: () => void;
  disableMore?: boolean;
  showMore?: boolean;
}

const HuntingInformation = ({
  huntingData,
  extraHeader,
  disableMore = false,
  showMore = false,
  onOpenMore,
}: HuntingInformationProps) => {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const startDate = convertStringToDate(huntingData.startDate);
  const endDate = huntingData.endDate
    ? convertStringToDate(huntingData.endDate)
    : null;

  const eventTime =
    huntingData &&
    format(startDate, 'HH:mm MMMM d', {locale: lt}) +
      'd. ' +
      getYear(startDate);

  const eventEndTime = endDate
    ? format(endDate, 'HH:mm MMMM d', {locale: lt}) + 'd. ' + getYear(endDate)
    : StatusConfig[huntingData?.status]?.text.toLowerCase() || '';

  return huntingData ? (
    <Container>
      <StatusBar barStyle="light-content" />
      {extraHeader}
      <InfoContainer>
        <Column>
          <Text.M variant={Text.Variant.secondary} weight={Text.Weight.medium}>
            {`Medžioklė #${huntingData.id}`}
          </Text.M>
          <Text.M variant={Text.Variant.secondary} weight={Text.Weight.medium}>
            {`${huntingData.huntingArea?.name}`}
          </Text.M>
          <DatesContainer>
            <Row>
              <Dot />
              <EventTime
                variant={Text.Variant.light}
                // weight={Text.Weight.medium}
              >
                {eventTime}
              </EventTime>
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

          {huntingData?.notes ? (
            <NotesContainer onPress={() => setNotesExpanded(!notesExpanded)}>
              <Notes
                variant={Text.Variant.light}
                numberOfLines={notesExpanded ? 100 : 1}
              >
                {huntingData?.notes}
              </Notes>
            </NotesContainer>
          ) : null}
        </Column>
        {showMore && (
          <MoreButton
            hitSlop={theme.hitSlop}
            onPress={onOpenMore}
            disabled={disableMore}
          >
            <DotsVerticalIcon />
          </MoreButton>
        )}
      </InfoContainer>
    </Container>
  ) : null;
};

const Container = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colors.primaryDark};
  padding-top: 5px;
`;

const InfoContainer = styled(View)`
  padding: 16px;
  padding-top: 0;
  /* height: 64px; */
  flex-direction: row;
`;

const EventTime = styled(Text.M)`
  line-height: 18px;
  vertical-align: middle;
`;

const Row = styled(View)`
  flex-direction: row;
  /* border: 1px solid red; */
  align-items: center;
  height: 18px;
`;

const Column = styled(View)`
  padding: 0 0 0 12px;
  justify-content: space-between;
  flex: 1;
`;

const MoreButton = styled(TouchableOpacity)<{disabled: boolean}>`
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
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
const NotesContainer = styled(TouchableOpacity)``;
const Notes = styled(Text.S)``;

export default HuntingInformation;
