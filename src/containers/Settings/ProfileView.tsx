import CheckboxCard from '@components/CheckboxCard';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button, {ButtonVariant} from '@root/components/Button';
import {appActions} from '@root/state/app/actions';
import {getUser} from '@root/state/data/dataSelectors';
import {settingsActions} from '@root/state/settings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {
  amITenantAdminOrOwner,
  getMyTenantUserByTenant,
  getTenantUser,
} from '@root/state/tenantUsers/tenantUsersSelectors';
import {Role} from '@root/state/types';
import {getHeight} from '@root/utils/layout';
import {isEmpty} from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Avatar from '../../components/Avatar';
import ButtonFooter from '../../components/ButtonFooter';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import {strings} from '../../strings';
import MemberInfo from './MemberInfo';
import MemberRoles from './MemberRoles';
import TicketNumber from '@root/components/TicketData';
type Props = {
  params: {userId: string; tenantId: string; ownerProfile: string};
};
const Profile = () => {
  const deviceHeight = getHeight();
  const route: RouteProp<Props> = useRoute();
  const {userId, tenantId, ownerProfile} = route.params;
  const [dangerZonePadding, setDangerZonePadding] = useState(deviceHeight);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const removeOnSync = useSelector(getOnSync.memberRemove);
  const updateOnSync = useSelector(getOnSync.memberUpdate);

  //selected user constants
  const user = useSelector(getUser(userId));
  const tenantUser = useSelector(getTenantUser(userId, tenantId));
  const tenantUserHuntingAreas =
    tenantUser?.huntingAreas?.map(ha => ha.id) || [];
  const ticketNumber = user?.ticketNumber;


  //connected user constants
  const myTenantUser = useSelector(getMyTenantUserByTenant(tenantId));
  const iAmAdminOrOwner = useSelector(amITenantAdminOrOwner(tenantId));
  const iCanEdit = iAmAdminOrOwner;
  const isMyProfileView = myTenantUser?.id === tenantUser?.id;

  const myRole = myTenantUser?.role || Role.hunter;
  const userRole = tenantUser?.role || Role.hunter;

  const showRoleOption = useCallback(
    (role: Role) => {
      if (userRole === role) {
        return true;
      }
      if (
        userRole === Role.owner &&
        myRole === Role.owner &&
        !isMyProfileView
      ) {
        return true;
      }
      if (userRole === Role.owner) {
        return false;
      }
      if (
        myRole === Role.userAdmin &&
        (userRole === Role.userAdmin || role === Role.userAdmin)
      ) {
        return false;
      }
      if (role === Role.owner) {
        return false;
      }
      if (myRole === Role.hunter || myRole === Role.farmer) {
        return false;
      }
      return true;
    },
    [userRole, myRole, isMyProfileView],
  );

  const iCanEditRole = useMemo(() => {
    if (isMyProfileView) {
      return false;
    }
    if (iAmAdminOrOwner) {
      if (myRole === userRole) {
        return false;
      }
      if (myRole === Role.userAdmin && userRole === Role.owner) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }, [myRole, userRole, iAmAdminOrOwner, isMyProfileView]);

  const iCanDeleteMember = useMemo(() => {
    if (isMyProfileView) {
      return false;
    }
    if (myRole === Role.owner) {
      return true;
    } else if (myRole === Role.userAdmin && userRole !== Role.owner) {
      return true;
    } else {
      return false;
    }
  }, [myRole, userRole, isMyProfileView]);

  const [settings, setSettings] = useState<{
    role: Role;
    huntingAreas: string[];
  }>({
    role: tenantUser?.role || Role.hunter,
    huntingAreas: tenantUserHuntingAreas,
  });
  const [huntingManager, setHuntingManager] = useState(
    !!tenantUser?.permissions.huntingManager,
  );
  const [emergencyContact, setEmergencyContact] = useState(
    !!tenantUser?.permissions?.emergencyContact,
  );
  const [footprintObservation, setFootprintObservation] = useState(
    !!tenantUser?.permissions.footprintObservation,
  );

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const phone = user?.phone;
  const email = user?.email;

  const handleSubmit = () => {
    if (tenantUser) {
      dispatch(
        settingsActions.updateMember({
          tenantUserId: tenantUser.id,
          data: settings,
          permissions: {
            huntingManager,
            footprintObservation,
            emergencyContact,
          },
        }),
      );
    }
  };

  const handleDeleteMember = () => {
    dispatch(
      appActions.showConfirmationModal({
        visible: true,
        title: strings.removeMember,
        subtitle: strings.confirmRemoveMember,
        primaryButton: strings.remove,
        secondaryButton: strings.common.cancel,
        loadingSelector: getOnSync.memberRemove,
        onPrimaryPress: () => {
          if (tenantUser?.id) {
            dispatch(settingsActions.removeMember(tenantUser.id));
          }
          dispatch(appActions.closeConfirmationModal());
        },
      }),
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <Container>
        <HeaderBack
          title={ownerProfile ? strings.ownerProfile : strings.profile}
        />
        <Content contentContainerStyle={{paddingBottom: 34}}>
          <UserInfo>
            <StyledAvatar
              firstName={firstName || ''}
              lastName={lastName || ''}
              isManager={false}
            />
            <Text.M>{`${firstName} ${lastName}`}</Text.M>
            <TicketNumber ticketNumber={ticketNumber} />
          </UserInfo>
          <MemberInfo email={email} phone={phone} />
          {!isEmpty(tenantUserHuntingAreas) && (
            <>
              <MemberRoles
                showRoleOption={showRoleOption}
                disabled={!iCanEditRole}
                selectedRole={settings.role}
                onChange={setSettings}
                availableHuntingAreas={tenantUser?.huntingAreas || []}
                huntingAreas={tenantUserHuntingAreas}
              />
              <CheckboxCard
                disabled={!iCanEdit}
                onPress={() => setHuntingManager(!huntingManager)}
                label={'Gali būti medžioklės vadovas'}
                selected={huntingManager}
              />
              <CheckboxCard
                disabled={!iCanEdit}
                onPress={() => setFootprintObservation(!footprintObservation)}
                label={'Gali stebėti pėdsakus'}
                selected={footprintObservation}
              />
              <CheckboxCard
                disabled={!iCanEdit}
                onPress={() => setEmergencyContact(!emergencyContact)}
                label={'112 kontaktinis asmuo'}
                selected={emergencyContact}
              />
              {iCanDeleteMember && (
                <DangerZone
                  topPadding={dangerZonePadding}
                  onLayout={event => {
                    if (dangerZonePadding === deviceHeight) {
                      const {y} = event.nativeEvent.layout;
                      const diff = deviceHeight - y;
                      const padding =
                        diff > 0 ? (diff < 100 ? 100 : diff) : 100;
                      setDangerZonePadding(padding);
                    }
                  }}
                >
                  <Button
                    variant={ButtonVariant.Danger}
                    text={'Pašalinti narį'}
                    onPress={handleDeleteMember}
                  />
                </DangerZone>
              )}
            </>
          )}
        </Content>
        {iCanEdit && (
          <ButtonFooter
            primaryButton={{
              action: handleSubmit,
              text: strings.update,
              loading: updateOnSync,
              disabled: removeOnSync,
            }}
            secondaryButton={{
              action: handleGoBack,
              text: strings.common.back,
              disabled: updateOnSync,
            }}
          />
        )}
      </Container>
    </>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
`;

const Content = styled(ScrollView)`
  padding: 0 16px;
`;

const StyledAvatar = styled(Avatar)`
  margin-bottom: 4px;
  margin-top: 24px;
`;

const UserInfo = styled(View)`
  align-items: center;
  margin-bottom: 8px;
`;

const DangerZone = styled(View)<{topPadding: number}>`
  padding-top: ${({topPadding}) => topPadding}px;
`;

export default Profile;
