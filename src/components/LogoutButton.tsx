import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {authActions} from '../state/auth/actions';
import LogoutIcon from './svg/Logout';
import Text from './Text';

const LogoutButton = (props: any) => {
  const dispatch = useDispatch();
  return (
    <Container
      style={props.style}
      onPress={() => dispatch(authActions.logout())}
    >
      <LogoutIcon color="white" />
      <Label variant={Text.Variant.light}>Atsijungti</Label>
    </Container>
  );
};

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const Label = styled(Text.M)`
  margin-left: 8px;
`;

export default LogoutButton;
