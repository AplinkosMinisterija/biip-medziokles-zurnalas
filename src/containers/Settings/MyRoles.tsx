import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ButtonRight from '@root/components/ButtonRight';
import {map} from 'lodash';
import React from 'react';
import styled from 'styled-components';
import Text, {Weight} from '../../components/Text';
import {ExtendedTenantUserData} from '../../state/data/dataSelectors';
import {strings} from '../../strings';
import {RootStackParamList, routes} from '../Router';

interface MemberRolesProps {
  tenantUsers: ExtendedTenantUserData[];
}

const MyRoles: React.FC<MemberRolesProps> = ({tenantUsers}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <>
      <Text.M weight={Text.Weight.medium}>{strings.myRoles}:</Text.M>
      {map(tenantUsers, (tenantUser: ExtendedTenantUserData) => {
        return (
          <StyledButton
            key={`tenanUserRole_${tenantUser.id}`}
            label={tenantUser?.tenant?.name}
            info={strings.role[tenantUser.role]}
            labelProps={{
              weight: Weight.medium,
            }}
            onPress={() => {
              navigation.navigate(routes.profile, {
                userId: tenantUser.user.id,
                tenantId: tenantUser?.tenant?.id,
              });
            }}
          />
        );
      })}
    </>
  );
};

const StyledButton = styled(ButtonRight)`
  background-color: #0046501a;
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0;
`;

export default MyRoles;
