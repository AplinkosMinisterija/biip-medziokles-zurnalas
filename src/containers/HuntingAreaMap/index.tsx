import {useRoute} from '@react-navigation/native';
import {
  getExtendedHunting,
  getExtendedHuntingMember,
} from '@root/state/data/dataSelectors';
import {HuntingMemberGeoData} from '@root/state/types';
import React, {useEffect, useMemo, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import {strings} from '../../strings';
import HuntingMap from '../Hunting/HuntingMap';
import {useGeoPoints} from '../Hunting/queries';

// Screen for hunting member point change on the map
const HuntingAreaMap = () => {
  const route = useRoute<any>();
  const {memberId, closePrevView = false, huntingId} = route.params;

  const huntingData = useSelector(getExtendedHunting(huntingId));
  const member = useSelector(getExtendedHuntingMember(memberId));
  const geoPoints = useGeoPoints(huntingId);

  const geo = useMemo(() => {
    if (geoPoints.data) {
      const geoList = [...geoPoints.data];
      const selectedIndex = geoList.findIndex(
        (item: HuntingMemberGeoData) => item.huntingMemberId === memberId,
      );
      const selectedGeoData =
        selectedIndex !== -1 ? geoList[selectedIndex] : null;
      geoList.splice(selectedIndex, 1);
      return {
        geoList,
        selectedGeoData,
      };
    }
  }, [geoPoints.data]);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={strings.memberOptions.locationOnMap} shadow={true} />
      {huntingData?.huntingArea?.id && (
        <Wrapper>
          <HuntingMap
            points={geo?.geoList}
            url={`https://maps.biip.lt/medziokle?mpvId=${
              huntingData.huntingArea.mpvId
            }&draw=true
            ${
              geo?.selectedGeoData
                ? `&zoom=${JSON.stringify({
                    x: geo?.selectedGeoData.x,
                    y: geo?.selectedGeoData.y,
                  })}`
                : ''
            }`}
            editMode={true}
            memberData={member}
            closePrevView={closePrevView}
          />
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Wrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

export default HuntingAreaMap;
