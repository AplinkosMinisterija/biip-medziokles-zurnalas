import Text from '@components/Text';
import FootPrintIcon from '@root/components/svg/FootPrint';
import {getExtendedHuntingArea, getMe} from '@root/state/data/dataSelectors';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {
  ExtendedFootprintObservation,
  FootprintObservationStatus,
} from '@state/types';
import {shortenName} from '@utils/formaters';
import {format, getDate, getMonth} from 'date-fns';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

interface Props {
  onPress: () => void;
  footPrint: ExtendedFootprintObservation;
}

export const StatusConfig: {
  [key in string]: {color: string; text: string};
} = {
  [FootprintObservationStatus.PLANNED]: {
    color: theme.colors.primary,
    text: '',
  },
  [FootprintObservationStatus.STARTED]: {
    color: theme.colors.primaryDark,
    text: 'Vyksta dabar',
  },
  [FootprintObservationStatus.ENDED]: {
    color: theme.colors.primaryLight,
    text: 'Baigtas stebėjimas',
  },
};

const ObservationListItem: React.FC<Props> = ({footPrint, onPress}) => {
  const date = new Date(footPrint.eventTime);
  const month = getMonth(date);
  const day = getDate(date);
  const eventTime = format(date, 'HH:mm');

  const myId = useSelector(getMe);
  const huntingArea = useSelector(
    getExtendedHuntingArea(footPrint.huntingArea.toString()),
  );
  console.tron.log(footPrint);
  const manager =
    myId === footPrint.createdBy?.id
      ? `${strings.me}`
      : `${shortenName(
          footPrint.createdBy?.firstName,
          footPrint.createdBy?.lastName,
        )}`;

  return (
    <Container onPress={onPress}>
      <Content>
        <MainContent>
          <DateContainer>
            <Text.XS
              variant={Text.Variant.primaryDark}
              weight={Text.Weight.medium}
            >
              {strings.monthAbbreviations[month + 1]}
            </Text.XS>
            <Text.XL
              variant={Text.Variant.primaryDark}
              weight={Text.Weight.bold}
            >
              {day}
            </Text.XL>
          </DateContainer>
          <Column>
            <DataRow>
              <Row>
                <Text.M weight={Text.Weight.medium}>{eventTime}</Text.M>
              </Row>
              <Row>
                <InfoItem>
                  {true && (
                    <LootInfoItem>
                      <Label
                        variant={Text.Variant.primaryDark}
                      >{`#${footPrint.id}`}</Label>
                    </LootInfoItem>
                  )}
                  {true && (
                    <InfoItem>
                      <FootPrintIcon
                        size={16}
                        color={theme.colors.primaryDark}
                      />
                      <Label variant={Text.Variant.primaryDark}>
                        {footPrint.recordsCount}
                      </Label>
                    </InfoItem>
                  )}
                </InfoItem>
              </Row>
            </DataRow>

            <Text.M weight={Text.Weight.medium}>{manager}</Text.M>
            <Text.S>{huntingArea.name}</Text.S>
          </Column>
        </MainContent>
        {StatusConfig[footPrint.status] ? (
          <Marker color={StatusConfig[footPrint.status]?.color}>
            <Text.S variant={Text.Variant.light}>
              {`${StatusConfig[footPrint.status]?.text}`}
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

const DateContainer = styled(View)`
  height: 64px;
  width: 64px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.primaryDark15};
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

export default ObservationListItem;
