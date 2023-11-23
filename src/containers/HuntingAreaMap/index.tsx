import {api} from '@apis/api';
import {useRoute} from '@react-navigation/native';
import {
  getExtendedHunting,
  getHuntingMember,
} from '@root/state/data/dataSelectors';
import {getHuntingMembersLocation} from '@root/state/huntingMembers/huntingMembersSelectors';
import {filter} from 'lodash';
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
  const [mapMembers, setMapMembers] = useState<{
    current: Array<string>;
    others: Array<string>;
  }>({
    current: [],
    others: [],
  });

  const memberData = useSelector(getHuntingMember(memberId));

  const huntingData = useSelector(getExtendedHunting(huntingId));

  const allMapMembers = useSelector(getHuntingMembersLocation(mapMembers));

  const otherMapMembers = filter(
    allMapMembers,
    member => member.id !== memberId,
  );

  const mapMembersLocation = otherMapMembers.map(member => {
    return member
      ? [
          member.id,
          member.hunting === huntingId ? '004650' : 'A5B9C0',
          member.location?.[0],
          member.location?.[1],
        ]
      : [];
  });

  useEffect(() => {
    if (huntingId) {
      api.getHuntingMapMembers(huntingId).then(res => {
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
            url={`https://maps.biip.lt/hunting?filter_attr=mpv_id&filter_val=${
              huntingData.huntingArea.mpvId
            }&geom_mode=pan${
              mapMembersLocation?.length
                ? `&geom_view=` + JSON.stringify(mapMembersLocation)
                : ''
            }${
              memberData?.location
                ? `&geom_current=${JSON.stringify(memberData.location)}`
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
