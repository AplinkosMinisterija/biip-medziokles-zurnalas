import React from 'react';
import {Image, View} from 'react-native';
import styled from 'styled-components';
import {emptyStateImg} from '../assets';
import Text from './Text';

const EmptyState = ({title}: any) => {
  return (
    <Container>
      <Image source={emptyStateImg} />
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Text.M)`
  margin-top: 16px;
  width: 70%;
  text-align: center;
`;

export default EmptyState;
