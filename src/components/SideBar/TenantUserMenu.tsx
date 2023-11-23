import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {routes} from '../../containers/Router';
import {ExtendedTenantUserData} from '../../state/data/dataSelectors';
import {strings} from '../../strings';
import {useHeightAnimation} from '../../utils/hooks';
import ExpandButton from '../ExpandButton';
import Text from '../Text';

const TenantUserMenu = ({tenantUser}: {tenantUser: ExtendedTenantUserData}) => {
  const navigation = useNavigation<any>();
  const [height, setHeight] = useState(0);
  const animation = useHeightAnimation({
    duration: 500,
    height,
  });

  return (
    <Container>
      <StyledBttonVertical
        label={tenantUser?.tenant?.name}
        onPress={() => (height === 0 ? setHeight(80) : setHeight(0))}
        variant={'light'}
        expanded={height === 80}
      />
      <AnimatedMenu style={{height: animation}}>
        <StyledBttonRignt
          onPress={() => {
            if (tenantUser) {
              navigation.dispatch(DrawerActions.toggleDrawer());
              navigation.navigate(routes.organization, {
                tenant: tenantUser?.tenant,
                huntingAreas: tenantUser.huntingAreas,
              });
            }
          }}
        >
          <Text.M variant={Text.Variant.light}>
            {strings.huntingAreaUser}
          </Text.M>
        </StyledBttonRignt>
        <StyledBttonRignt
          onPress={() => {
            if (tenantUser) {
              navigation.dispatch(DrawerActions.toggleDrawer());
              navigation.navigate(routes.members, {
                tenantUser,
              });
            }
          }}
        >
          <Text.M variant={Text.Variant.light}>{strings.members}</Text.M>
        </StyledBttonRignt>
      </AnimatedMenu>
    </Container>
  );
};

const Container = styled(View)`
  margin-bottom: 16px;
  background-color: rgba(225, 225, 225, 0.15);
  border-radius: 8px;
  padding: 10px;
`;

const AnimatedMenu = styled(Animated.View)`
  overflow: hidden;
`;

const StyledBttonVertical = styled(ExpandButton)`
  padding: 16px 0;
  height: 40px;
  justify-content: center;
`;

const StyledBttonRignt = styled(TouchableOpacity)`
  height: 40px;
  justify-content: center;
  padding: 0 0 0 16px;
`;

export default TenantUserMenu;
