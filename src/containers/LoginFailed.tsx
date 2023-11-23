import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styled from 'styled-components';
import Button from '../components/Button';
import Logo from '../components/svg/Logo';
import Text from '../components/Text';
import {strings} from '../strings';
import {routes} from './Router';

const LoginFailed = (): JSX.Element => {
  const navigation = useNavigation<any>();
  return (
    <Container>
      <Content onPress={Keyboard.dismiss}>
        <ContentWrapper behavior="padding">
          <BiipLogo />
          <Title variant={Text.Variant.light}>{strings.signIpDenied}</Title>
          <Paragraph variant={Text.Variant.light}>
            {strings.signInInstruction}
          </Paragraph>

          <Paragraph variant={Text.Variant.light}>
            {strings.singInInstructionPrivate}
          </Paragraph>
          <View>
            <Paragraph variant={Text.Variant.light}>
              {strings.singInInstructionCompany}
            </Paragraph>
            <StyledButton
              variant={Button.Variant.Transparent}
              textVariant={Button.TextVariant.White}
              textSizeVariant={Button.TextSizeVariant.S}
              textStyle={{textDecorationLine: 'underline'}}
              buttonStyle={{alignItems: 'flex-start'}}
              text="prieiga@aad.am.lt"
              onPress={() => Linking.openURL(`mailto:${'prieiga@aad.am.lt'}`)}
            />
          </View>
          <LoginButton
            variant={Button.Variant.Secondary}
            text={strings.toLogin}
            onPress={() => {
              navigation.replace(routes.login);
            }}
          />
        </ContentWrapper>
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  display: flex;
  flex: 1;
  background-color: ${({theme}) => theme.colors.primaryDark};
`;

const Content = styled(TouchableWithoutFeedback)`
  flex: 1;
`;

const BiipLogo = styled(Logo)`
  margin-bottom: 20px;
`;

const ContentWrapper = styled(KeyboardAvoidingView)`
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  flex: 1;
`;

const Title = styled(Text.L)`
  margin-bottom: 12px;
`;
const Paragraph = styled(Text.S)`
  text-align: center;
  margin-top: 16px;
`;
const LoginButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;
const StyledButton = styled(Button)`
  padding: 0;
  margin-top: 8px;
`;

export default LoginFailed;
