import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import ButtonRight from '../../components/ButtonRight';
import Header from '../../components/Header';
import LogoutButton from '../../components/LogoutButton';
import {getMe} from '../../state/data/dataSelectors';
import {strings} from '../../strings';
import {hasNotch, isIOS} from '../../utils/layout';
import {routes} from '../Router';

const Menu = (props: any) => {
  const navigation = useNavigation<any>();
  const me = useSelector(getMe);
  return (
    <Container>
      <Header {...props} />
      <Content>
        <StyledBurttonRight
          label={strings.profile}
          onPress={() => navigation.navigate(routes.profile, {id: me})}
        />
        <StyledBurttonRight
          label={strings.organization}
          onPress={() => navigation.navigate(routes.organization)}
        />
        <StyledBurttonRight
          label={strings.members}
          onPress={() => navigation.navigate(routes.members)}
        />
        <StyledBurttonRight
          label={strings.limits}
          onPress={() => navigation.navigate(routes.limits)}
        />
        <StyledLogoutButton />
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
  flex: 1;
  padding: 16px;
  margin-bottom: ${isIOS && hasNotch ? '85px' : '70px'};
`;

const StyledBurttonRight = styled(ButtonRight)`
  background-color: ${({theme}) => theme.colors.primaryDark15};
  border-radius: 8px;
  margin: 8px 0;
  padding: 12px 16px;
`;

const StyledLogoutButton = styled(LogoutButton)`
  margin-top: 45px;
`;

export default Menu;
