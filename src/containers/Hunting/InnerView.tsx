import {api} from '@apis/api';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import BackButton from '@root/components/BackButton';
import EmptyState from '@root/components/EmptyState';
import {dataActions} from '@root/state/data/actions';
import {getExtendedHunting, getMe} from '@root/state/data/dataSelectors';
import {getHuntingMembersLocation} from '@root/state/huntingMembers/huntingMembersSelectors';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {strings} from '@root/strings';
import {theme} from '@root/theme';
import {formatHuntingMembersList} from '@root/utils/format';
import {HuntingStatus} from '@state/types';
import {map} from 'lodash';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootStackParamList, routes} from '../Router';
import ExtraHeaderManager from './ExtraHeaderManager';
import ExtraHeaderMember from './ExtraHeaderMember';
import HuntingInformation from './HuntingInformation';
import HuntingLoots from './HuntingLoots';
import HuntingMap from './HuntingMap';
import HuntingMembers from './HuntingMembers';
import HuntingTabs, {Selection} from './HuntingTabs';

type HuntingInnerRouteProp = RouteProp<RootStackParamList, routes.huntingInner>;

const HuntingInner = () => {
  const route: HuntingInnerRouteProp = useRoute();
  const {huntingId, tab} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<string>(Selection.Members);
  const [mapMembers, setMapMembers] = useState<{
    current: Array<string>;
    others: Array<string>;
  }>({
    current: [],
    others: [],
  });

  const allMapMembers = useSelector(getHuntingMembersLocation(mapMembers));

  const mapMembersLocation = map(allMapMembers, member => {
    return member
      ? [
          member?.id,
          member.hunting === huntingId ? '004650' : 'A5B9C0',
          member.location?.[0],
          member.location?.[1],
        ]
      : [];
  });

  useEffect(() => {
    tab && setSelectedTab(tab);
  }, [tab]);

  useEffect(() => {
    if (huntingData?.id) {
      api.getHuntingMapMembers(huntingId).then(res => {
        setMapMembers(res);
      });
    }
  }, [selectedTab]);

  const me = useSelector(getMe);
  const loading = useSelector(getOnSync.data);
  const huntingData = useSelector(getExtendedHunting(huntingId));
  const isHuntingAdmin = huntingData?.manager.user?.id === me;
  const huntingMembersSectionList =
    huntingData &&
    formatHuntingMembersList(huntingData.huntingMembers, huntingData);
  const myHuntingMember = huntingData?.huntingMembers?.find(
    member => member.user.id === me,
  );

  //TODO: Neaisku kodel taip padaryta - sitas sukelia nuolatinius bereikalngus rerenderius
  useEffect(() => {
    !huntingData && dispatch(dataActions.getMainData());
    const interval = setInterval(() => {
      if (huntingData?.status === HuntingStatus.Ready) {
        dispatch(dataActions.getMainData({hideLoader: true}));
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [huntingData]);

  const showingMap = !!(
    selectedTab === Selection.Map && huntingData?.huntingArea?.id
  );

  return (
    <Wrapper>
      {!huntingData && loading ? (
        <ActivityIndicatorWrapper>
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        </ActivityIndicatorWrapper>
      ) : huntingData ? (
        <>
          <HuntingInformation
            huntingData={huntingData}
            extraHeader={
              huntingId ? (
                isHuntingAdmin ? (
                  <ExtraHeaderManager huntingId={huntingId} />
                ) : (
                  <ExtraHeaderMember huntingId={huntingId} />
                )
              ) : (
                <></>
              )
            }
            onOpenMore={() =>
              navigation.navigate(routes.huntingMore, {
                huntingId,
              })
            }
            disableMore={
              !isHuntingAdmin &&
              huntingData?.status !== HuntingStatus.Started &&
              huntingData?.status !== HuntingStatus.Ended
            }
            showMore={!!myHuntingMember}
          />
          <HuntingTabs
            huntingData={huntingData}
            onOpenTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          <Content>
            <MapWrapper>
              {huntingData.huntingArea && (
                <HuntingMap
                  url={`https://maps.biip.lt/medziokle?mpvId=${
                    huntingData.huntingArea.mpvId
                  }&geom_mode=view&geom_view=${JSON.stringify(
                    mapMembersLocation,
                  )}`}
                />
              )}
            </MapWrapper>
            {!showingMap && (
              <AbsoluteWrapper>
                {selectedTab === Selection.Loot && (
                  <HuntingLoots huntingData={huntingData} />
                )}
                {selectedTab === Selection.Members && (
                  <HuntingMembers
                    huntingData={huntingData}
                    huntingMembersSectionList={huntingMembersSectionList || []}
                    isHuntingAdmin={isHuntingAdmin || false}
                  />
                )}
              </AbsoluteWrapper>
            )}
          </Content>
        </>
      ) : (
        <>
          <Container>
            <StatusBar barStyle="light-content" />
            <Header>
              <BackButton onPress={() => navigation.goBack()} />
            </Header>
          </Container>
          <EmptyState title={strings.emptyState.noData} />
        </>
      )}
    </Wrapper>
  );
};

const Content = styled(View)`
  flex: 1;
`;

const AbsoluteWrapper = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const MapWrapper = styled(View)`
  flex: 1;
`;

const Wrapper = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.almostWhite};
`;

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.primaryDark};
  padding: 16px;
  padding-top: ${({theme}) => `${theme.header}px`};
`;

const ActivityIndicatorWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

const Header = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  background-color: ${({theme}) => theme.colors.primaryDark};
`;

export default HuntingInner;
