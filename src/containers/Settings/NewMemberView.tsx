import CheckboxCard from '@components/CheckboxCard';
import {getHuntingAreaByTenant} from '@root/state/data/dataSelectors';
import {settingsActions} from '@root/state/settings/actions';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {getMyTenantUserByTenant} from '@root/state/tenantUsers/tenantUsersSelectors';
import {Role} from '@root/state/types';
import {isIOS} from '@utils/layout';
import {goBack} from '@utils/navigation';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import ButtonFooter from '../../components/ButtonFooter';
import HeaderBack from '../../components/HeaderBack';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import {strings} from '../../strings';
import MemberRoles from './MemberRoles';

interface FormData {
  firstName: string;
  lastName: string;
  personalCode: string;
  ticketNumber: string;
  email: string;
  permissions: {
    huntingManager: boolean;
    footprintObservation: boolean;
    emergencyContact: boolean;
  };
}
interface RequestData extends FormData {
  role: Role;
  huntingAreas: string[];
  tenant: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email(strings.error.invalidEmail).optional(),
  firstName: Yup.string().required(strings.error.required),
  lastName: Yup.string().required(strings.error.required),
  personalCode: Yup.string()
    .matches(/^[0-9]+$/, strings.error.invalidPersonalCode)
    .min(11, strings.error.invalidPersonalCode)
    .max(11, strings.error.invalidPersonalCode)
    .required(strings.error.required),

  ticketNumber: Yup.number()
    .typeError(strings.error.invalidTicketNumber)
    .required(strings.error.required),
});

const NewMember = ({
  route: {
    params: {tenant},
  },
}: any) => {
  const dispatch = useDispatch();

  const onSync = useSelector(getOnSync.user);
  const availableHuntingAreas = useSelector(getHuntingAreaByTenant(tenant.id));
  const myTenantUser = useSelector(getMyTenantUserByTenant(tenant.id));
  const myRole = myTenantUser?.role || Role.hunter;

  const [settings, setSettings] = useState({
    role: Role.hunter,
    huntingAreas: availableHuntingAreas.map(h => h.id),
  });

  const handleSubmitUpdate = (values: FormData) => {
    if (tenant?.id) {
      const data: RequestData = {
        ...values,
        role: settings.role,
        huntingAreas: settings.huntingAreas,
        tenant: tenant.id,
      };
      if (values.email) {
        data.email = values.email;
      }
      dispatch(settingsActions.inviteTenantUser(data));
    }
  };

  return (
    <Container>
      <HeaderBack title={strings.newMember} />
      <Formik
        initialValues={
          {
            firstName: '',
            lastName: '',
            personalCode: '',
            ticketNumber: '',
            email: '',
            permissions: {
              huntingManager: true,
              emergencyContact: false,
              footprintObservation: false,
            },
          } as FormData
        }
        validateOnChange={false}
        onSubmit={(values: FormData) => {
          handleSubmitUpdate(values);
        }}
        validationSchema={validationSchema}
      >
        {({handleChange, setFieldValue, handleSubmit, values, errors}) => (
          <>
            <Content contentContainerStyle={{paddingBottom: 24}}>
              <StyledInput
                variant={TextField.Variant.regular}
                label={strings.name}
                onChangeText={(value: string) => {
                  handleChange('firstName')(value);
                }}
                value={values.firstName}
                name="firstName"
                error={errors.firstName}
                optional={false}
              />
              <StyledInput
                variant={TextField.Variant.regular}
                label={strings.lastName}
                onChangeText={(value: string) => {
                  handleChange('lastName')(value);
                }}
                value={values.lastName}
                name="phone"
                error={errors.lastName}
                optional={false}
              />
              <StyledInput
                variant={TextField.Variant.regular}
                label={strings.personalNumber}
                onChangeText={(value: string) => {
                  handleChange('personalCode')(value);
                }}
                value={values.personalCode}
                name="personalCode"
                error={errors.personalCode}
                keyboardType={isIOS ? 'phone-pad' : 'numeric'}
                optional={false}
              />
              <StyledInput
                variant={TextField.Variant.regular}
                label={strings.ticketNumber}
                onChangeText={(value: string) => {
                  handleChange('ticketNumber')(value);
                }}
                value={values.ticketNumber}
                name="huntingTicket"
                error={errors.ticketNumber}
                keyboardType={isIOS ? 'phone-pad' : 'numeric'}
                optional={false}
              />
              <StyledInput
                variant={TextField.Variant.regular}
                label={strings.email}
                onChangeText={(value: string) => {
                  handleChange('email')(value);
                }}
                value={values.email}
                error={errors.email}
                name="email"
                autoCapitalize="none"
              />
              <EmailExplanation>
                Nurodytu elektroninio pašto adresu bus išsiųstas pakvietimas
              </EmailExplanation>
              <MemberRoles
                showRoleOption={(role: Role) => {
                  if (role === Role.owner) {
                    return false;
                  }
                  if (role === Role.userAdmin && myRole == Role.userAdmin) {
                    return false;
                  }
                  return true;
                }}
                selectedRole={settings.role}
                onChange={(values: {role: Role; huntingAreas: string[]}) =>
                  setSettings(values)
                }
                availableHuntingAreas={availableHuntingAreas}
                huntingAreas={availableHuntingAreas.map(h => h.id)}
              />
              <CheckboxCard
                onPress={() =>
                  setFieldValue(
                    'permissions.huntingManager',
                    !values.permissions.huntingManager,
                  )
                }
                label={'Gali būti medžioklės vadovas'}
                selected={values.permissions.huntingManager}
              />
              <CheckboxCard
                onPress={() =>
                  setFieldValue(
                    'permissions.footprintObservation',
                    !values.permissions.footprintObservation,
                  )
                }
                label={'Gali stebėti pėdsakus'}
                selected={values.permissions.footprintObservation}
              />
              <CheckboxCard
                onPress={() =>
                  setFieldValue(
                    'permissions.emergencyContact',
                    !values.permissions.emergencyContact,
                  )
                }
                label={'112 kontaktinis asmuo'}
                selected={values.permissions.emergencyContact}
              />
            </Content>
            <ButtonFooter
              primaryButton={{
                action: handleSubmit,
                text: strings.huntingInvitationTitle,
                loading: onSync,
                disabled:
                  !values.firstName ||
                  !values.lastName ||
                  !values.personalCode ||
                  !values.ticketNumber ||
                  onSync,
              }}
              secondaryButton={{
                action: goBack,
                text: strings.common.cancel,
                disabled: onSync,
              }}
            />
          </>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.white};
  flex: 1;
  height: 100%;
`;

const StyledInput = styled(TextField)`
  margin-top: 16px;
`;

const Content = styled(ScrollView)`
  padding: 0 16px;
`;

const EmailExplanation = styled(Text.S)`
  margin-top: 4px;
`;

export default NewMember;
