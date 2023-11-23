import HeaderClose from '@root/components/HeaderClose';
import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import styled from 'styled-components';

const StartObservationModal = () => {
  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={'Naujas stebėjimas'} shadow={false} />
      <Text>StartObservationModal</Text>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  flex: 1;
  background-color: white;
`;

export default StartObservationModal;
