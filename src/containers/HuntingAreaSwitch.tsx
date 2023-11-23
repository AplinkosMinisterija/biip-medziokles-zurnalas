import {
  ExtendedHuntingAreaData,
  ExtendedTenantUserData,
  getMyTenantUsers,
} from '@root/state/data/dataSelectors';
import {getSelectedHuntingAreaData} from '@root/state/huntingArea/huntingAreaSelectors';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderClose from '../components/HeaderClose';
import MyHuntingsOption from '../components/SideBar/MyHuntingsOption';
import TenantOption from '../components/SideBar/TenantOption';
import Text from '../components/Text';
import {strings} from '../strings';

const HuntingAreaSwitch = (): JSX.Element => {
  const tenantsUsers: ExtendedTenantUserData[] | null =
    useSelector(getMyTenantUsers);
  const selectedHuntingArea: ExtendedHuntingAreaData | undefined = useSelector(
    getSelectedHuntingAreaData,
  );
  return (
    <Container>
      <HeaderClose title={strings.huntingAreaSwitchTitle} />

      <Content>
        <InfoText>{strings.huntingAreaSwitchInfo}</InfoText>
        <MyHuntingsOption selected={!selectedHuntingArea} />
        {tenantsUsers?.map(tenantsUser => (
          <TenantOption
            key={`tenant_${tenantsUser?.tenant?.id}`}
            tenantsUsers={tenantsUser}
            selectedHuntingArea={selectedHuntingArea || null}
          />
        ))}
      </Content>
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 0 16px;
`;

const InfoText = styled(Text.M)`
  text-align: center;
  padding: 16px 0;
`;

export default HuntingAreaSwitch;
