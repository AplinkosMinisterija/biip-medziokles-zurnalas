import HorizontalTabs from '@root/components/HorizontalTabs';
import {getOnSync} from '@root/state/sync/syncSelectors';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import ButtonFooter from '../../components/ButtonFooter';
import TextArea from '../../components/TextArea';
import {strings} from '../../strings';
import {useKeyboard} from '../../utils/hooks';
import {isIOS} from '../../utils/layout';

interface LootData {
  hasScabies: boolean;
  hasDefects: boolean;
}

type AppearanceProps = {
  onPress: (val: LootData) => void;
  onBack: () => void;
};

const Appearance = ({onPress, onBack}: AppearanceProps) => {
  const openKeyboard = useKeyboard();

  const loading = useSelector(getOnSync.loot);

  const routesScabies = [
    {key: true, title: strings.common.yes},
    {key: false, title: strings.common.no},
  ];

  const routesDefects = [
    {key: true, title: strings.common.yes},
    {key: false, title: strings.common.no},
  ];

  const ValidationSchema = Yup.object().shape({
    appearanceNotes: Yup.string().when('hasDefects', {
      is: true,
      then: Yup.string().required(strings.error.required),
    }),
  });

  return (
    <Formik
      initialValues={{
        appearanceNotes: '',
        hasDefects: true,
        hasScabies: false,
      }}
      validationSchema={ValidationSchema}
      validateOnChange={false}
      onSubmit={values => {
        onPress({
          hasScabies: values.hasScabies,
          hasDefects: values.hasDefects,
          ...(values.hasDefects && {appearanceNotes: values.appearanceNotes}),
        });
      }}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        setFieldError,
        values,
        errors,
      }) => (
        <>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={isIOS ? 180 : 150}
          >
            <Form>
              <View>
                <HorizontalTabs
                  routes={routesScabies}
                  label={strings.hasScabies}
                  selectedKey={values.hasScabies}
                  onSelect={val => setFieldValue('hasScabies', val.key)}
                />
                <HorizontalTabs
                  routes={routesDefects}
                  label={strings.hasDefects}
                  selectedKey={values.hasDefects}
                  onSelect={val => {
                    setFieldError('appearanceNotes', '');
                    setFieldValue('hasDefects', val.key);
                  }}
                />
              </View>

              {values.hasDefects && (
                <StyledTextField
                  autoFocus={false}
                  name="appearanceNotes"
                  value={values.appearanceNotes}
                  onChangeText={(value: string) => {
                    setFieldError('appearanceNotes', '');
                    handleChange('appearanceNotes')(value);
                  }}
                  returnKeyType="done"
                  error={errors.appearanceNotes}
                />
              )}
            </Form>
          </KeyboardAwareScrollView>
          {!openKeyboard && (
            <ButtonFooter
              primaryButton={{
                action: handleSubmit,
                text: strings.common.continue,
                disabled: Boolean(errors?.appearanceNotes),
                loading: loading,
              }}
              secondaryButton={{
                action: onBack,
                text: strings.common.back,
                disabled: loading,
              }}
            />
          )}
        </>
      )}
    </Formik>
  );
};

const Form = styled(View)`
  flex: 1;
`;

const StyledTextField = styled(TextArea)`
  padding: 8px 16px;
`;

export default Appearance;
