import {api} from '@apis/api';
import {useRoute} from '@react-navigation/native';
import {
  getExtendedHunting,
  getHuntingMember,
} from '@root/state/data/dataSelectors';
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
  const [mapMembers, setMapMembers] = useState<
    Array<{
      x: number;
      y: number;
      type?: 'current' | 'other';
      huntingMemberId: number;
      phone: string;
      fullName: string;
    }>
  >([]);

  const memberData = useSelector(getHuntingMember(memberId));

  const huntingData = useSelector(getExtendedHunting(huntingId));

  // const allMapMembers = useSelector(getHuntingMembersLocation(mapMembers));
  // const myMapMember: any;
  // const otherMapMembers = filter(mapMembers, member => {
  //   if (member.huntingMemberId === memberId) {
  //     myMapMember = member;
  //     return false;
  //   }

  //   return true;
  // });

  // const myMapMember = filter(
  //   mapMembers,
  //   member => member.huntingMemberId === memberId,
  // );

  // const mapMembersLocation = otherMapMembers.map(member => {
  //   return member
  //     ? [
  //         member.id,
  //         member.hunting === huntingId ? '004650' : 'A5B9C0',
  //         member.location?.[0],
  //         member.location?.[1],
  //       ]
  //     : [];
  // });

  useEffect(() => {
    if (huntingId) {
      api.getGeoPoints(huntingId).then(res => {
        console.tron.log('getGeoPoints', res);
        // res.findIndex(item => item.huntingMemberId === memberId);

        // res.splice();
        setMapMembers(res);
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
            }&draw=true&${
              memberData?.location
                ? `&zoom=${JSON.stringify({
                    x: memberData.location[0],
                    y: memberData.location[1],
                  })}`
                : ''
            }`}
            editMode={true}
            memberId={memberId}
            closePrevView={closePrevView}
            initialLocation={memberData?.location}
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
