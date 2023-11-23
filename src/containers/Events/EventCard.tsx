import {
  format,
  getDate,
  getMonth,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
} from 'date-fns';
import ltLTLocale from 'date-fns/locale/lt';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import PeopleIcon from '../../components/svg/People';
import TargetIcon from '../../components/svg/Target';
import Text from '../../components/Text';
import {HuntingStatus, UserData} from '../../state/types';
import {strings} from '../../strings';
import {theme} from '../../theme';
import {shortenName} from '../../utils/formaters';

interface EventCardInterface {
  id: string | number;
  organizer: UserData;
  date: Date;
  endDate?: Date | null;
  membersCount?: number;
  loot: number | null | undefined;
  onPress: () => void;
  showHuntingArea?: boolean;
  huntingArea?: string;
  status: HuntingStatus;
  isAdmin?: boolean;
  violation?: boolean;
}

export const StatusConfig: {
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
  [HuntingStatus.Ended]: {
    color: theme.colors.primaryLight,
    text: strings.huntingStatus.huntingEnded,
  },
  // [HuntingStatus.Created]: {
  //   color: theme.colors.primaryUltraLight,
  //   text: strings.huntingStatus.notStarted,
  // },
};

const EventCard: React.FC<EventCardInterface> = ({
  id,
  organizer,
  date,
  membersCount,
  loot,
  onPress,
  status,
  showHuntingArea = false,
  huntingArea,
  isAdmin,
  endDate,
  violation = false,
}) => {
  const month = getMonth(date);
  const day = getDate(date);
  const eventTime = format(date, 'HH:mm');

  const eventEndTime = endDate
    ? isSameDay(date, endDate)
      ? format(endDate, 'HH:mm')
      : format(endDate, 'MMM d, HH:mm', {locale: ltLTLocale})
    : null;

  const isTodayEnded =
    date && status && isToday(date) && status === HuntingStatus.Ended;

  const notStarted =
    date &&
    status &&
    isBefore(date, startOfDay(new Date())) &&
    status === HuntingStatus.Created;

  // const showMarker =
  //   (status &&
  //     (status === HuntingStatus.Ready || status === HuntingStatus.Started)) ||
  //   isTodayEnded ||
  //   notStarted;
  const huntingManager = isAdmin
    ? `${strings.me}`
    : `${shortenName(organizer?.firstName, organizer?.lastName)}`;

  return (
    <Container onPress={onPress}>
      <Content>
        <MainContent>
          <DateContainer isViolation={violation}>
            <Text.XS
              variant={
                violation ? Text.Variant.secondary : Text.Variant.primaryDark
              }
              weight={Text.Weight.medium}
            >
              {strings.monthAbbreviations[month + 1]}
            </Text.XS>
            <Text.XL
              variant={
                violation ? Text.Variant.secondary : Text.Variant.primaryDark
              }
              weight={Text.Weight.bold}
            >
              {day}
            </Text.XL>
          </DateContainer>
          <Column>
            <DataRow>
              <Row>
                <Text.M weight={Text.Weight.medium}>{eventTime}</Text.M>
                {/* {eventEndTime && (
                  <Text.M
                    weight={Text.Weight.medium}
                  >{` - ${eventEndTime}`}</Text.M>
                )} */}
              </Row>
              <Row>
                <InfoItem>
                  {!!loot && (
                    <LootInfoItem>
                      <TargetIcon size={16} color={theme.colors.primaryDark} />
                      <Label variant={Text.Variant.primaryDark}>{loot}</Label>
                    </LootInfoItem>
                  )}
                  {!!membersCount && (
                    <InfoItem>
                      <PeopleIcon size={16} color={theme.colors.primaryDark} />
                      <Label variant={Text.Variant.primaryDark}>
                        {membersCount}
                      </Label>
                    </InfoItem>
                  )}
                </InfoItem>
              </Row>
            </DataRow>

            <Text.M weight={Text.Weight.medium}>
              {`${strings.manager}: ${huntingManager}`}
            </Text.M>
            <Text.S>{`#${id} ${showHuntingArea ? huntingArea : ''}`}</Text.S>
          </Column>
        </MainContent>
        {StatusConfig[status] ? (
          <Marker color={StatusConfig[status]?.color}>
            <Text.S variant={Text.Variant.light}>
              {`${StatusConfig[status]?.text}`}
            </Text.S>
          </Marker>
        ) : null}
      </Content>
    </Container>
  );
};

const Container = styled(TouchableOpacity)`
  ${() => theme.shadow.light};
  margin: 8px 16px;
  border-radius: 8px;
`;

const Content = styled(View)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${() => theme.colors.almostWhite};
`;

const MainContent = styled(View)`
  flex-direction: row;
  padding: 12px;
`;

const Label = styled(Text.S)`
  margin-left: 2px;
`;

const Column = styled(View)`
  padding: 0 0 0 12px;
  height: 64px;
  justify-content: space-between;
  flex: 1;
`;

const DateContainer = styled(View)<{isViolation: boolean}>`
  height: 64px;
  width: 64px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${({theme, isViolation}) =>
    isViolation ? `${theme.colors.secondary}1A` : theme.colors.primaryDark15};
`;

const InfoItem = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const LootInfoItem = styled(View)`
  flex-direction: row;
  margin-right: 9px;
`;

const Row = styled(View)`
  flex-direction: row;
`;

const DataRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const Marker = styled(View)<{color: any}>`
  background-color: ${({color}) => color};
  padding: 8px 0;
  align-items: center;
`;

export default EventCard;
