import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import EmptyState from '@root/components/EmptyState';
import HuntingTabViewHeader from '@root/components/headers/HuntingTabViewHeader';
import {appActions} from '@root/state/app/actions';
import {getExtendedHunting, getMe} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {HuntingStatus} from '@root/state/types';
import {formatHuntingMembersList} from '@root/utils/format';
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {strings} from '../../strings';
import {routes, TabsParamList} from '../Router';
import HuntingInformation from './HuntingInformation';
import HuntingLoots from './HuntingLoots';
import HuntingMap from './HuntingMap';
import HuntingMembers from './HuntingMembers';
import HuntingTabs, {Selection} from './HuntingTabs';
import {useGeoPoints} from './queries';

type HuntingRouteProps = RouteProp<TabsParamList, routes.hunting>;

const TabView = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const route: HuntingRouteProps = useRoute();
  const huntingData = useSelector(getExtendedHunting(route.params.huntingId));
  const [selectedTab, setSelectedTab] = useState<string>(Selection.Members);

  const geoPoints = useGeoPoints(route.params.huntingId);

  useEffect(() => {
    route.params.tab && setSelectedTab(route.params.tab);
  }, [route.params.tab]);

  const me = useSelector(getMe);
  const loading = useSelector(getOnSync.updateStatus);
  const huntingMembersSectionList = formatHuntingMembersList(
    huntingData?.huntingMembers,
    huntingData,
  );
  const isHuntingAdmin = huntingData?.manager.user?.id === me;
  const myHuntingMember = huntingData?.huntingMembers?.find(
    member => member.user.id === me,
  );

  const handleEndHunting = () => {
    if (huntingData?.id) {
      dispatch(
        appActions.showConfirmationModal({
          visible: true,
          title: strings.confirmHuntingEnd,
          subtitle: strings.confirmHuntingEndSubtitle,
          primaryButton: strings.endHunting,
          secondaryButton: strings.common.cancel,
          onPrimaryPress: () => {
            dispatch(
              huntingActions.updateHuntingStatus({
                id: huntingData?.id,
                status: HuntingStatus.Ended,
              }),
            );
            dispatch(appActions.closeConfirmationModal());
          },
        }),
      );
    }
  };
  const showingMap = !!(
    selectedTab === Selection.Map && huntingData?.huntingArea?.id
  );

  useEffect(() => {
    geoPoints.refetch();
  }, [showingMap, geoPoints]);

  return (
    <Container>
      {huntingData ? (
        <Content>
          <StatusBar barStyle="light-content" />
          <HuntingInformation
            huntingData={huntingData}
            extraHeader={
              <HuntingTabViewHeader
                handleEndHunting={handleEndHunting}
                loading={loading}
                isHuntingAdmin={isHuntingAdmin}
              />
            }
            onOpenMore={() =>
              navigation.navigate(routes.huntingMore, {
                huntingId: huntingData?.id,
              })
            }
            disableMore={false}
            showMore={!!myHuntingMember}
          />
          <HuntingTabs
            huntingData={huntingData}
            onOpenTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          <Wrapper>
            {huntingData?.huntingArea?.id && (
              <MapWrapper>
                <HuntingMap
                  extraFooter={90}
                  points={geoPoints.data}
                  url={`https://maps.biip.lt/medziokle?mpvId=${huntingData.huntingArea.mpvId}
                  `}
                />
              </MapWrapper>
            )}
            {!showingMap && (
              <AbsoluteWrapper>
                {selectedTab === Selection.Loot && (
                  <HuntingLoots huntingData={huntingData} />
                )}
                {selectedTab === Selection.Members && (
                  <HuntingMembers
                    huntingData={huntingData}
                    huntingMembersSectionList={huntingMembersSectionList || []}
                    isHuntingAdmin={isHuntingAdmin}
                  />
                )}
              </AbsoluteWrapper>
            )}
          </Wrapper>
        </Content>
      ) : (
        <EmptyState title={strings.emptyState.noData} />
      )}
    </Container>
  );
};

const Wrapper = styled(View)`
  flex: 1;
`;

const AbsoluteWrapper = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.almostWhite};
  flex: 1;
`;

const MapWrapper = styled(View)`
  flex: 1;
`;

const Content = styled(View)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.almostWhite};
`;

export default TabView;
