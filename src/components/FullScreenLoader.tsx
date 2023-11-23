import React from 'react';
import {ActivityIndicator, View, ViewProps} from 'react-native';
import styled from 'styled-components';

const FullScreenLoader = ({
  color = 'white',
  style,
}: {
  color?: string;
  style?: ViewProps;
}) => {
  return (
    <Overlay style={style}>
      <ActivityIndicator size="large" color={color} />
    </Overlay>
  );
};
const Overlay = styled(View)<any>`
  background-color: ${({theme}) => theme.colors.overlay};
  position: absolute;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

export default FullScreenLoader;
