import {useNavigation, useRoute} from '@react-navigation/native';
import {appActions} from '@root/state/app/actions';
import {getExtendedHunting} from '@root/state/data/dataSelectors';
import {huntingActions} from '@root/state/huntings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {
  GuestInvitation as MemberGuestInvitation,
  NATIONALITY,
} from '@root/state/types';
import {useKeyboard} from '@utils/hooks';
import {isIOS} from '@utils/layout';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../../components/Button';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import {strings} from '../../strings';
import {routes} from '../Router';
import GuestSwitch from './GuestSwitch';
import ImageSelection from './ImageSelection';

const ValidationSchema = Yup.object().shape({
  firstName: Yup.string().when('nationality', {
    is: (nationality: NATIONALITY) => nationality === NATIONALITY.foreigner,
    then: Yup.string().required(strings.error.required),
  }),
  lastName: Yup.string().when('nationality', {
    is: (nationality: NATIONALITY) => nationality === NATIONALITY.foreigner,
    then: Yup.string().required(strings.error.required),
  }),
  ticketNumber: Yup.string()
    .typeError(strings.error.invalidTicketNumber)
    .required(strings.error.required),
});

const GuestInvitation = () => {
  const route = useRoute<any>();
  const {huntingId} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const openKeyboard = useKeyboard();
  const loading = useSelector(getOnSync.huntingMember);
  const hunting = useSelector(getExtendedHunting(huntingId));

  const handleSubmitInvitation = (values: MemberGuestInvitation) => {
    if (hunting?.id) {
      dispatch(
        huntingActions.inviteHuntingMember({
          user:
            values.nationality === NATIONALITY.local
              ? {
                  nationality: values.nationality,
                  ticketNumber: values.ticketNumber,
                }
              : values,
          huntingId: route.params.huntingId,
        }),
      );
    }
  };

  return (
    <Container>
      <HeaderBack title={strings.guestInvitationTitle} />
      <Formik
        initialValues={
          {
            nationality: NATIONALITY.local,
            firstName: '',
            lastName: '',
            ticketNumber: '',
            email: '',
            document: '',
          } as MemberGuestInvitation
        }
        validationSchema={ValidationSchema}
        validateOnChange={false}
        onSubmit={(values: MemberGuestInvitation) => {
          handleSubmitInvitation(values);
        }}
      >
        {({
          handleChange,
          handleSubmit,
          handleReset,
          setErrors,
          setFieldError,
          values,
          errors,
        }) => (
          <>
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <Form>
                <GuestSwitch
                  name="nationality"
                  value={values.nationality}
                  onChange={(value: NATIONALITY) => {
                    setErrors({});
                    handleChange('nationality')(value);
                  }}
                />
                {values.nationality === NATIONALITY.foreigner && (
                  <>
                    <StyledTextField
                      name="name"
                      label={strings.name}
                      value={values.firstName || ''}
                      onChangeText={(value: string) => {
                        setFieldError('firstName', '');
                        handleChange('firstName')(value);
                      }}
                      returnKeyType="next"
                      error={errors.firstName}
                    />
                    <StyledTextField
                      name="lastName"
                      label={strings.lastName}
                      value={values.lastName || ''}
                      onChangeText={(value: string) => {
                        setFieldError('lastName', '');
                        handleChange('lastName')(value);
                      }}
                      returnKeyType="next"
                      error={errors.lastName}
                    />
                  </>
                )}
                <StyledTextField
                  name="ticketNumber"
                  label={strings.ticketNumber}
                  value={values.ticketNumber}
                  onChangeText={(value: string) => {
                    setFieldError('ticketNumber', '');
                    handleChange('ticketNumber')(value);
                  }}
                  keyboardType={
                    values.nationality !== NATIONALITY.foreigner
                      ? isIOS
                        ? 'number-pad'
                        : 'numeric'
                      : 'default'
                  }
                  error={errors.ticketNumber}
                />
                {values.nationality === NATIONALITY.foreigner && (
                  <>
                    <StyledTextField
                      name="email"
                      label={strings.email}
                      value={values.email || ''}
                      onChangeText={(value: string) => {
                        setFieldError('email', '');
                        handleChange('email')(value);
                      }}
                      error={errors.ticketNumber}
                      autoCapitalize="none"
                    />
                    <Text.M weight={Text.Weight.medium}>
                      Medžioklės bilieto nuotrauka
                    </Text.M>
                    <ImageSelection
                      value={values.document}
                      onChange={(value: any) => {
                        handleChange('document')(value);
                      }}
                      onPressPhoto={() => {
                        navigation.navigate(routes.imagePreview, {
                          image: values.document,
                          onDeletePress: () => {
                            handleChange('document')('');
                          },
                        });
                      }}
                    />
                  </>
                )}
              </Form>
            </KeyboardAwareScrollView>
            {!openKeyboard && (
              <FooterContainer>
                <CleanButton
                  variant={Button.Variant.PrimaryLight}
                  text={strings.common.cancel}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <CreateButton
                  variant={Button.Variant.PrimaryDark}
                  text={'Pridėti'}
                  onPress={handleSubmit}
                  loading={loading}
                />
              </FooterContainer>
            )}
          </>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Form = styled(View)`
  padding: 16px 16px 0 16px;
  flex: 1;
`;

const FooterContainer = styled(View)`
  flex-direction: row;
  padding: ${({theme}) => `16px 16px ${theme.footer}px 16px`};
  background-color: white;
  position: absolute;
  bottom: 0;
`;

const StyledTextField = styled(TextField)`
  padding: 8px 0;
`;

const CleanButton = styled(Button)`
  padding: 0 8px 0 0;
  width: 50%;
`;

const CreateButton = styled(Button)`
  padding: 0 0 0 8px;
  width: 50%;
`;

export default GuestInvitation;
