import {routes} from '@containers/Router';
import {useNavigation} from '@react-navigation/core';
import {getAppUpdateInfo} from '@root/state/app/appSelectors';
import {ExtendedHuntingAreaData} from '@root/state/data/dataSelectors';
import {getSelectedHuntingAreaData} from '@root/state/huntingArea/huntingAreaSelectors';
import {TenantData} from '@root/state/types';
import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {strings} from '../strings';
import HeaderHamburger from './HeaderHamburger';
import UpDownIcon from './svg/UpDown';
import Text, {Variant} from './Text';

const Header = () => {
  const navigation = useNavigation<any>();
  const huntingArea: ExtendedHuntingAreaData | undefined = useSelector(
    getSelectedHuntingAreaData,
  );
  const appUpdateInfo = useSelector(getAppUpdateInfo);
  const showBadge = !!appUpdateInfo && appUpdateInfo.needsUpdate;
  const selectedTenant: TenantData | null = huntingArea?.tenant || null;

  const handleMenuClick = () => {
    navigation?.toggleDrawer();
  };

  const tenantName = selectedTenant ? selectedTenant.name : '';

  const huntingAreaName = huntingArea?.name;

  const subtitle =
    selectedTenant && huntingArea ? huntingAreaName : strings.myHuntings;
  const title = selectedTenant ? tenantName : strings.personalHuntings;

  return (
    <Container>
      <Content>
        <StyledHeaderHamburger
          showBadge={showBadge}
          onPress={handleMenuClick}
        />
        <RightContainer
          onPress={() => navigation.navigate(routes.huntingAreaSwitch)}
        >
          <Column>
            <Text.M>{title}</Text.M>
            <Text.S variant={Variant.secondary}>{subtitle}</Text.S>
          </Column>
          <UpDownIcon />
        </RightContainer>
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  background-color: white;
  ${({theme}) => theme.shadow.light}
`;

const Content = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const RightContainer = styled(TouchableOpacity)`
  padding: 16px;
  // padding-top: 0;
  flex-direction: row;
  align-items: center;
`;

const Column = styled(View)`
  align-items: flex-end;
  padding-right: 8px;
`;

const StyledHeaderHamburger = styled(HeaderHamburger)`
  padding: 0 16px 0 16px;
`;

export default Header;
