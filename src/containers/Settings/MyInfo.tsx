import {settingsActions} from '@state/settings/actions';
import {isIOS} from '@utils/layout';
import {Formik} from 'formik';
import React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import 'yup-phone';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import {strings} from '../../strings';

const ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(strings.error.invalidEmail)
    .required(strings.error.required),
  phone: Yup.string()
    .phone('LT', true, strings.error.invalidPhoneNumber)
    .required(strings.error.required),
});

interface UserFormProps {
  userId: string;
  email?: string | null;
  phone?: string | null;
  formikRef: any;
}

interface FormData {
  email: string;
  phone: string;
}

const MemberInfo = ({email, phone, userId, formikRef}: UserFormProps) => {
  const dispatch = useDispatch();

  const handleSubmitUpdate = (values: FormData) => {
    dispatch(settingsActions.updateUser({userId, data: values}));
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={
        {
          email: email || '',
          phone: phone || '',
        } as FormData
      }
      validationSchema={ValidationSchema}
      validateOnChange={false}
      onSubmit={(values: FormData) => {
        handleSubmitUpdate(values);
      }}
    >
      {({handleChange, values, errors}) => (
        <>
          <StyledInput
            variant={TextField.Variant.regular}
            label={strings.email}
            onChangeText={(value: string) => {
              handleChange('email')(value);
            }}
            value={values.email}
            name="email"
            error={errors.email}
          />
          <StyledInput
            variant={TextField.Variant.regular}
            label={strings.phoneNumber}
            onChangeText={(value: string) => {
              handleChange('phone')(value);
            }}
            value={values.phone}
            name="phone"
            error={errors.phone}
            keyboardType={isIOS ? 'phone-pad' : 'numeric'}
          />
        </>
      )}
    </Formik>
  );
};

const StyledInput = styled(TextField)`
  margin-top: 16px;
`;

const SubmitButton = styled(Button)`
  padding: 0;
  margin-left: auto;
  margin-top: 14px;
`;

export default MemberInfo;
