import {useNavigation} from '@react-navigation/native';
import {isIOS} from '@utils/layout';
import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled from 'styled-components';
import Button from '../../components/Button';
import Text from '../../components/Text';
import {strings} from '../../strings';

const Dialog = ({route}: any) => {
  const navigation = useNavigation<any>();

  const title = route?.params?.title;
  const message = route?.params?.message;

  return (
    <Container onPress={navigation.goBack}>
      <Overlay behavior={isIOS ? 'padding' : 'height'}>
        <DialogBox>
          <Title weight={Text.Weight.medium}>{title}</Title>
          <Message>{message}</Message>
          <Button
            text={strings.common.understand}
            onPress={navigation.goBack}
          />
        </DialogBox>
      </Overlay>
    </Container>
  );
};

const Container = styled(TouchableWithoutFeedback)`
  height: 100%;
`;

const Overlay = styled(KeyboardAvoidingView)<any>`
  background-color: ${({theme}) => theme.colors.overlay};

  justify-content: center;
  align-items: center;
  flex: 1;
`;

const DialogBox = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  padding: 24px;
  width: 85%;
  border-radius: 16px;
  ${({theme}) => theme.shadow.lingt};
`;

const Title = styled(Text.M)`
  text-align: center;
  margin-bottom: 8px;
`;

const Message = styled(Text.S)`
  text-align: center;
  margin-bottom: 24px;
  line-height: 21px;
`;

export default Dialog;
