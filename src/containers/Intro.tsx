import React from 'react';
import {SafeAreaView, View} from 'react-native';
import styled from 'styled-components';
import Logo from '../components/svg/Logo';

const Intro = (): JSX.Element => {
  return (
    <Container>
      <Content>
        <BiipLogo />
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  display: flex;
  flex: 1;
  background-color: ${({theme}) => theme.colors.primaryDark};
  padding: 0 24px;
`;

const Content = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const BiipLogo = styled(Logo)`
  margin-bottom: 20px;
`;

export default Intro;
