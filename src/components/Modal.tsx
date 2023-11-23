import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components';
import {isIOS} from '../utils/layout';
import CloseButton from './CloseButton';
import Text from './Text';

const Modal = ({title, children, wrap, preventClose}: any) => {
  const navigation = useNavigation<any>();

  return (
    <Container onPress={preventClose ? () => {} : () => navigation.goBack()}>
      <Overlay behavior={isIOS ? 'padding' : 'height'}>
        <Content activeOpacity={1} onPress={Keyboard.dismiss} wrap={wrap}>
          <StyledCloseButton onPress={navigation.goBack} />
          {title && <Title>{title}</Title>}
          {children}
        </Content>
      </Overlay>
    </Container>
  );
};

const Container = styled(TouchableWithoutFeedback)`
  flex: 1;
`;

const Overlay = styled(KeyboardAvoidingView)<any>`
  background-color: ${({theme}) => theme.colors.overlay};
  flex: 1;
`;

const Content = styled(TouchableOpacity)<{wrap: boolean}>`
  max-height: 92%;
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: auto;
  ${({wrap}) => (wrap ? 'flex: 1' : '')};
`;

const Title = styled(Text.M)`
  padding: 0 16px;
  text-align: center;
`;

const StyledCloseButton = styled(CloseButton)`
  margin-left: auto;
  padding: 24px;
`;

export default Modal;
