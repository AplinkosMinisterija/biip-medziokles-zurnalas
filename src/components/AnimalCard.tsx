import {routes} from '@containers/Router';
import {useNavigation} from '@react-navigation/native';
import {ExtendedLootData, getMe} from '@root/state/data/dataSelectors';
import {amITenantAdminByHunting} from '@root/state/tenantUsers/tenantUsersSelectors';
import {AnimalFormTypes, State} from '@root/state/types';
import {convertStringToDate} from '@utils/time';
import {format} from 'date-fns';
import {differenceInMinutes} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {strings} from '../strings';
import {theme} from '../theme';
import Countdown from './Countdown';
import ClockIcon from './svg/Clock';
import ClockAlertIcon from './svg/ClockAlert';
import NotesIcon from './svg/Notes';
import PersonIcon from './svg/Person';
import Text from './Text';

interface AnimalCardProps {
  lootData: ExtendedLootData;
}

const AnimalCard: React.FC<AnimalCardProps> = ({lootData}) => {
  const isConnected = useSelector((state: State) => state.network.isConnected);
  const amIAdminByHunting = useSelector(
    amITenantAdminByHunting(lootData.huntingMember.hunting),
  );
  const me = useSelector(getMe);
  const isMyLoot = lootData?.huntingMember?.user?.id === me;
  const navigation = useNavigation<any>();
  const isWolf = lootData.animal.formType === AnimalFormTypes.Wolf;
  const isWolfFormCompleted = !!lootData.attributes?.age;
  const gender = lootData.attributes?.category;
  const age = lootData.attributes?.age;
  const amount = lootData.amount;
  const eventTime = format(
    convertStringToDate(lootData.registeredAt || lootData.createdAt),
    'yyyy-MM-dd HH:mm',
  );
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const recentlyHunted =
      differenceInMinutes(
        new Date(),
        convertStringToDate(lootData.registeredAt || lootData.createdAt),
      ) <= 15;

    setShowCountdown(recentlyHunted);
  }, [lootData]);

  const route = isWolf
    ? isWolfFormCompleted
      ? routes.lootInfo
      : amIAdminByHunting || isMyLoot
        ? routes.additionalLootInformation
        : routes.lootInfo
    : routes.lootInfo;
  let additionalInfo =
    !!gender || !!age
      ? `(${gender ? strings[gender] : ''}${gender && age ? ', ' : ''}${
          age ? `${strings[age]}` : ''
        })`
      : '';
  return (
    <Container
      blurred={showCountdown}
      onPress={() => {
        if (route) {
          navigation.navigate(route, {
            loot: lootData,
          });
        }
      }}
      isOffline={lootData.offline}
    >
      <MainData>
        <ImageWrapper
          blurred={showCountdown}
          isOffline={lootData.offline}
          isViolation={lootData.violation}
        >
          {lootData.animal.iconUrl && (
            <SvgUri
              uri={lootData.animal.iconUrl}
              width="32px"
              height="22px"
              fill={
                lootData.offline
                  ? theme.colors.yellow
                  : lootData.violation
                    ? theme.colors.secondary
                    : theme.colors.primaryLight
              }
            />
          )}
        </ImageWrapper>
        <Wrapper>
          <AnimalDataWrapper
            blurred={showCountdown}
            isOffline={lootData.offline}
          >
            <HeadingWrapper>
              <Text.M variant={Text.Variant.primaryDark}>
                {lootData.attributes?.other?.name ?? lootData.animal.name}
              </Text.M>
              {additionalInfo && (
                <AdditionalData>{additionalInfo}</AdditionalData>
              )}
              {amount > 1 && <AdditionalData>{`x${amount}`}</AdditionalData>}
            </HeadingWrapper>
            <IconWrapper>
              {lootData.attributes?.comments &&
                lootData.attributes?.comments.length > 0 && (
                  <NotesIcon size={14} />
                )}
            </IconWrapper>
          </AnimalDataWrapper>
          <LootDataWrapper>
            <Row>
              {showCountdown ? (
                <>
                  <ClockAlertIcon />
                  <Countdown
                    time={900}
                    date={convertStringToDate(
                      lootData.registeredAt || lootData.createdAt,
                    )}
                    onFinish={() => setShowCountdown(false)}
                  />
                </>
              ) : (
                <>
                  <ClockIcon size={14} />
                  <LootData
                    variant={Text.Variant.primary}
                  >{` ${eventTime}`}</LootData>
                </>
              )}
            </Row>
            {typeof lootData.huntingMember === 'object' && (
              <HunterRow blurred={showCountdown} isOffline={lootData.offline}>
                <PersonIcon size={14} />
                <LootData variant={Text.Variant.primary}>
                  {` ${lootData.huntingMember?.user?.firstName.charAt(0)}. ${
                    lootData.huntingMember?.user?.lastName
                  }`}
                </LootData>
              </HunterRow>
            )}
          </LootDataWrapper>
        </Wrapper>
      </MainData>
      {isWolf && !isWolfFormCompleted && isConnected && (
        <AdditionalDataLabelContainer>
          <Text.S variant={Text.Variant.light}>
            {strings.requiredAdditionalData}
          </Text.S>
        </AdditionalDataLabelContainer>
      )}
    </Container>
  );
};

const Container = styled(TouchableOpacity)<{
  isOffline?: boolean;
  blurred: boolean;
}>`
  background-color: white;
  margin: 8px 16px;
  border-radius: 8px;
  ${({blurred, isOffline}) =>
    blurred && !isOffline ? theme.shadow.ultraLight : theme.shadow.light}
`;

const Wrapper = styled(View)`
  margin-left: 8px;
  justify-content: space-between;
  flex: 1;
`;

const MainData = styled(View)`
  flex-direction: row;
  padding: 8px;
  width: 100%;
`;

const AdditionalDataLabelContainer = styled(View)`
  background-color: ${({theme}) => theme.colors.primary};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px 0;
  align-items: center;
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-right: 16px;
`;

const HunterRow = styled(View)<{
  blurred: boolean;
  isOffline?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  padding-right: 16px;
  opacity: ${({blurred, isOffline}) => (blurred && !isOffline ? 0.5 : 1)};
`;

const LootDataWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const AnimalDataWrapper = styled(View)<{blurred: boolean; isOffline?: boolean}>`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  opacity: ${({blurred, isOffline}) => (blurred && !isOffline ? 0.5 : 1)};
`;

const ImageWrapper = styled(View)<{
  blurred: boolean;
  isOffline?: boolean;
  isViolation?: boolean;
}>`
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  height: 48px;
  width: 48px;
  background-color: ${({isOffline, isViolation}) =>
    isOffline
      ? `${theme.colors.yellow}1A`
      : isViolation
        ? `${theme.colors.secondary}1A`
        : '#edf1f2'};
  opacity: ${({blurred, isOffline}) => (blurred && !isOffline ? 0.5 : 1)};
`;

const AdditionalData = styled(Text.M)`
  line-height: 18px;
  margin-left: 6px;
  text-transform: lowercase;
`;

const LootData = styled(Text.S)`
  line-height: 20px;
`;

const IconWrapper = styled(View)`
  margin-left: auto;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
`;

const HeadingWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
`;

export default AnimalCard;
