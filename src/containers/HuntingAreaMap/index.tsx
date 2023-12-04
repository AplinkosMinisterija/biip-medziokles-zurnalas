import {api} from '@apis/api';
import {useRoute} from '@react-navigation/native';
import {getExtendedHunting} from '@root/state/data/dataSelectors';
import {HuntingMemberGeoData} from '@root/state/types';
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../../components/HeaderClose';
import {strings} from '../../strings';
import HuntingMap from '../Hunting/HuntingMap';

const HuntingAreaMap = () => {
  const route = useRoute<any>();
  const {memberId, closePrevView = false, huntingId} = route.params;
  const [mapMembers, setMapMembers] = useState<Array<HuntingMemberGeoData>>([]);
  const [memberGeoData, setMemberGeoData] =
    useState<HuntingMemberGeoData | null>(null);

  const huntingData = useSelector(getExtendedHunting(huntingId));

  useEffect(() => {
    if (huntingId) {
      api.getGeoPoints(huntingId).then(res => {
        const selectedIndex = res.findIndex(
          (item: HuntingMemberGeoData) => item.huntingMemberId === memberId,
        );
        if (selectedIndex !== -1) {
          setMemberGeoData(res[selectedIndex]);
        }
        setMapMembers(res.toSpliced(selectedIndex, 1));
      });
    }
  }, [huntingId]);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={strings.memberOptions.locationOnMap} shadow={true} />
      {huntingData?.huntingArea?.id && (
        <Wrapper>
          <HuntingMap
            url={`https://maps.biip.lt/medziokle?mpvId=${
              huntingData.huntingArea.mpvId
            }&draw=true
            ${mapMembers ? `&points=${JSON.stringify(mapMembers)}` : ''}
            ${
              memberGeoData
                ? `&zoom=${JSON.stringify({
                    x: memberGeoData.x,
                    y: memberGeoData.y,
                  })}`
                : ''
            }`}
            editMode={true}
            memberData={memberGeoData}
            closePrevView={closePrevView}
            // initialLocation={memberData?.location}
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
