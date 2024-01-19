import {useRoute} from '@react-navigation/native';
import {queryClient} from '@root/App';
import {
  getExtendedHunting,
  getExtendedHuntingMember,
} from '@root/state/data/dataSelectors';
import {HuntingMemberGeoData} from '@root/state/types';
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import {strings} from '../../strings';
import HuntingMap from '../Hunting/HuntingMap';

// Screen for hunting member point change on the map
const HuntingAreaMap = () => {
  const route = useRoute<any>();
  const {memberId, closePrevView = false, huntingId} = route.params;
  const [mapMembers, setMapMembers] = useState<Array<HuntingMemberGeoData>>([]);
  const [memberGeoData, setMemberGeoData] =
    useState<HuntingMemberGeoData | null>(null);

  const huntingData = useSelector(getExtendedHunting(huntingId));
  const member = useSelector(getExtendedHuntingMember(memberId));

  useEffect(() => {
    const geoData = queryClient.getQueriesData<Array<HuntingMemberGeoData>>([
      'geoPoints',
      huntingData?.id,
    ]);

    if (geoData[0][1]) {
      const geoList = [...geoData[0][1]];
      const selectedIndex = geoList.findIndex(
        (item: HuntingMemberGeoData) => item.huntingMemberId === memberId,
      );
      if (selectedIndex !== -1) {
        setMemberGeoData(geoList[selectedIndex]);
      }
      geoList.splice(selectedIndex, 1);
      setMapMembers(geoList);
    }
  }, []);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={strings.memberOptions.locationOnMap} shadow={true} />
      {huntingData?.huntingArea?.id && (
        <Wrapper>
          <HuntingMap
            points={mapMembers}
            url={`https://maps.biip.lt/medziokle?mpvId=${
              huntingData.huntingArea.mpvId
            }&draw=true
            ${
              memberGeoData
                ? `&zoom=${JSON.stringify({
                    x: memberGeoData.x,
                    y: memberGeoData.y,
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
