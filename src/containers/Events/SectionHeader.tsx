import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import Text from '../../components/Text';

const SectionHeader = ({children}: any) => {
  return (
    <Container>
      <Title>{children}</Title>
    </Container>
  );
};

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  padding: 8px 16px;
  background-color: ${({theme}) => theme.colors.white};
`;

const Title = styled(Text.M)`
  font-size: 16px;
  color: ${({theme}) => theme.colors.primary};
`;

export default SectionHeader;
