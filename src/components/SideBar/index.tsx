import {routes} from '@containers/Router';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {
  getAppHomeScreenMode,
  getAppUpdateInfo,
} from '@root/state/app/appSelectors';
import {AppHomeScreenMode} from '@root/state/types';
import {theme} from '@root/theme';
import {
  ExtendedTenantUserData,
  getMyTenantUsers,
  getMyUser,
} from '@state/data/dataSelectors';
import {map} from 'lodash';
import React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {strings} from '../../strings';
import AnimatedColorButton from '../AnimatedColorButton';
import AppVersionText from '../AppVersionText';
import SimpleSwitchBar from '../SimpleSwitchBar';
import Avatar from './../Avatar';
import ButtonRight from './../ButtonRight';
import LogoutButton from './../LogoutButton';
import Text from './../Text';
import TicketNumber from './../TicketData';
import TenantUserMenu from './TenantUserMenu';

const SideBar = () => {
  const navigation = useNavigation<any>();
  const myTenantUsers: ExtendedTenantUserData[] = useSelector(getMyTenantUsers);
  const me = useSelector(getMyUser);
  const appUpdateInfo = useSelector(getAppUpdateInfo);
  const homeScreenMode = useSelector(getAppHomeScreenMode);
  const dispatch = useDispatch();
  const switchOption = [
    {key: AppHomeScreenMode.HUNTING, title: 'Medžioklė'},
    {key: AppHomeScreenMode.SNOW_FOOTPRINT, title: 'Pėdsakai sniege'},
  ];
  return (
    <Container>
      <UserInfo>
        {me && (
          <StyledAvatar
            firstName={me?.firstName}
            lastName={me?.lastName}
            isManager={false}
          />
        )}
        <Text.M variant={Text.Variant.light}>
          {me ? `${me?.firstName} ${me?.lastName}` : strings.emptyState.noData}
        </Text.M>
        {me?.ticketNumber && <TicketNumber ticketNumber={me.ticketNumber} />}
      </UserInfo>
      {!!me?.id && (
        <StyledBttonRignt
          label={strings.myProfile}
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
            navigation.navigate(routes.myProfile, {userId: me.id});
          }}
          variant={'light'}
        />
      )}
      <Menu>
        {!!myTenantUsers?.length && (
          <>
            <MenuTitle variant={Text.Variant.light}>
              {strings.myTenantUsers}
            </MenuTitle>
            {map(myTenantUsers, (tenantUser: ExtendedTenantUserData) => (
              <TenantUserMenu
                tenantUser={tenantUser}
                key={`tenantUserMenu_${tenantUser.id}`}
              />
            ))}
          </>
        )}
        <SimpleSwitchBar
          routes={switchOption}
          selectedKey={homeScreenMode}
          onSelect={(val: AppHomeScreenMode) => {
            dispatch(appActions.setAppHomeScreenMode(val));
            navigation.dispatch(DrawerActions.closeDrawer());
            if (val === AppHomeScreenMode.HUNTING) {
              navigation.navigate(routes.tabs);
            } else {
              navigation.navigate(routes.footPrintObservationList);
            }
          }}
        />
      </Menu>
      {!!appUpdateInfo && appUpdateInfo.needsUpdate && (
        <StyledAnimeButton
          showRightIcon={false}
          color1={'rgba(225, 225, 225, 0.15)'}
          color2={theme.colors.secondary}
          label={'Atnaujink mobilią programėlę'}
          onPress={() => {
            Linking.openURL(appUpdateInfo.url);
          }}
          variant={'light'}
        />
      )}
      <StyledLogoutButton />
      <AppVersionText />
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colors.primaryDark};
  height: 100%;
  padding: 0 16px;
`;

const StyledAvatar = styled(Avatar)`
  margin-bottom: 4px;
  margin-top: 24px;
`;

const UserInfo = styled(View)`
  align-items: center;
  padding-bottom: 16px;
`;

const Menu = styled(ScrollView)`
  flex: 1;
  padding-top: 24px;
`;

const MenuTitle = styled(Text.M)`
  margin-bottom: 8px;
`;

const StyledLogoutButton = styled(LogoutButton)`
  margin-top: 24px;
  margin-bottom: 12px;
`;

const StyledBttonRignt = styled(ButtonRight)`
  background-color: rgba(225, 225, 225, 0.15);
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0;
`;

const StyledAnimeButton = styled(AnimatedColorButton)`
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0;
`;

export default SideBar;
