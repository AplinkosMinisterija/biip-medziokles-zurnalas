import Button from '@components/Button';
import Logo from '@components/svg/Logo';
import TextField from '@components/TextField';
import AppVersionText from '@root/components/AppVersionText';
import {Row} from '@root/components/layout';
import PrivacyPolicyText from '@root/components/PrivacyPolicyText';
import {config, DEV_OR_STG} from '@root/config';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {strings} from '@root/strings';
import {authActions} from '@state/auth/actions';
import {Formik} from 'formik';
import React, {useRef} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  username: Yup.string().required(strings.error.required),
  password: Yup.string().required(strings.error.required),
});

interface FormValues {
  username: string;
  password: string;
}

const initValues: FormValues = {
  username: DEV_OR_STG ? config.DEV_EMAIL : '',
  password: DEV_OR_STG ? config.DEV_PASSWORD : '',
};

const Login = () => {
  const passwordRef = useRef<TextInput>();
  const dispatch = useDispatch();
  const loading = useSelector(getOnSync.user);
  const eVartaiLoading = useSelector(getOnSync.login);

  const handleSubmit = (values: {username: string; password: string}) => {
    dispatch(authActions.login(values));
  };

  const handleLoginEVartai = () => {
    dispatch(authActions.loginEVartai());
  };

  return (
    <Container>
      <Content onPress={Keyboard.dismiss}>
        <ContentWrapper behavior="padding">
          <BiipLogo />
          <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validationSchema={ValidationSchema}
          >
            {({handleChange, handleSubmit, values, errors}) => (
              <>
                <StyledInput
                  name="username"
                  variant={TextField.Variant.light}
                  label={strings.user}
                  onChangeText={handleChange('username')}
                  onSubmitEditing={() => passwordRef?.current?.focus()}
                  value={values.username}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  autoCapitalize="none"
                  error={errors.username}
                />
                <StyledInput
                  ref={passwordRef}
                  name="password"
                  variant={TextField.Variant.light}
                  label={strings.pasword}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  secureTextEntry={true}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  error={errors.password}
                />
                <LoginButton
                  variant={Button.Variant.Secondary}
                  text={strings.login}
                  onPress={handleSubmit}
                  loading={loading}
                />
                <LoginButton
                  variant={Button.Variant.Secondary}
                  text={strings.login2}
                  onPress={handleLoginEVartai}
                  loading={eVartaiLoading}
                />
              </>
            )}
          </Formik>
        </ContentWrapper>
      </Content>
      <FooterWrapper>
        <AppVersionText />
        <PrivacyPolicyText />
      </FooterWrapper>
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

const LoginButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

const StyledInput = styled(TextField)`
  margin: 4px 0;
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

const FooterWrapper = styled(Row)`
  justify-content: space-around;
  flex-wrap: wrap;
`;

export default Login;
