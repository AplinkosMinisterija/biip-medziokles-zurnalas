import {useNavigation} from '@react-navigation/native';
import {ExtendedTenantUserData, getMe} from '@root/state/data/dataSelectors';
import {
  getTenantAdmins,
  getTenantOwner,
} from '@root/state/tenants/tenantsSelectors';
import {HuntingAreaData} from '@root/state/types';
import {isEmpty, map} from 'lodash';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import UserCard from '../../components/UserCard';
import {strings} from '../../strings';
import {routes} from '../Router';
import MemberInfo from './MemberInfo';

const Organization = ({
  route: {
    params: {tenant, huntingAreas},
  },
}: any) => {
  const navigation = useNavigation<any>();

  const tenantOwners: ExtendedTenantUserData[] = useSelector(
    getTenantOwner(tenant?.id),
  );

  const tenantAdmins: ExtendedTenantUserData[] = useSelector(
    getTenantAdmins(tenant?.id),
  );

  const me: string = useSelector(getMe);
  return (
    <Container>
      <HeaderBack title={strings.huntingAreaUser} />
      <Content>
        {!!tenant && <Title weight={Text.Weight.bold}>{tenant.name}</Title>}
        {!!tenant && <MemberInfo email={tenant.email} phone={tenant.phone} />}
        {!isEmpty(tenantOwners) && (
          <>
            <Label weight={Text.Weight.medium}>{strings.manager}:</Label>
            {map(tenantOwners, (ownerTenantUser: ExtendedTenantUserData) => {
              return (
                <Card
                  key={`card_${ownerTenantUser.id}`}
                  onPress={() => {
                    if (ownerTenantUser?.user?.id === me) {
                      navigation.navigate(routes.myProfile, {
                        userId: ownerTenantUser?.user?.id,
                        ownerProfile: true,
                      });
                    } else {
                      navigation.navigate(routes.profile, {
                        userId: ownerTenantUser?.user?.id,
                        tenantId: ownerTenantUser.tenant.id,
                        ownerProfile: true,
                      });
                    }
                  }}
                >
                  <UserCard user={ownerTenantUser.user} />
                </Card>
              );
            })}
          </>
        )}
        {!isEmpty(tenantAdmins) && (
          <>
            <Label weight={Text.Weight.medium}>{strings.admin}:</Label>
            {map(tenantAdmins, (adminTenantUser: ExtendedTenantUserData) => {
              return (
                <Card
                  key={`card_${adminTenantUser.id}`}
                  onPress={() => {
                    if (adminTenantUser.user.id === me) {
                      navigation.navigate(routes.myProfile, {
                        userId: adminTenantUser.user.id,
                        ownerProfile: true,
                      });
                    } else {
                      navigation.navigate(routes.profile, {
                        userId: adminTenantUser.user.id,
                        tenantId: adminTenantUser.tenant.id,
                        ownerProfile: true,
                      });
                    }
                  }}
                >
                  <UserCard user={adminTenantUser.user} />
                </Card>
              );
            })}
          </>
        )}
        <Label weight={Text.Weight.medium}>{strings.huntingAreas}:</Label>
        {map(huntingAreas, (huntingArea: HuntingAreaData) => {
          return (
            <HuntingAreaLabel key={`huntingArea_${huntingArea.id}`}>
              {huntingArea.name}
            </HuntingAreaLabel>
          );
        })}
      </Content>
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
  height: 100%;
`;

const Content = styled(View)`
  padding: 16px 16px;
`;

const Card = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  ${({theme}) => theme.shadow.light};
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled(Text.M)`
  margin-bottom: 8px;
  margin-top: 24px;
`;

const Title = styled(Text.M)`
  text-align: center;
  margin-top: 24px;
`;

const HuntingAreaLabel = styled(Text.S)`
  margin-bottom: 8px;
`;

export default Organization;
