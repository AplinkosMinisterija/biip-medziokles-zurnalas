import Button, {ButtonVariant} from '@root/components/Button';
import HeaderClose from '@root/components/HeaderClose';
import {Padding} from '@root/components/layout';
import AmountInput from '@root/containers/LootRegistration/AmountInput';
import {Formik} from 'formik';
import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import styled from 'styled-components';

const StartObservationModal = () => {
  return (
    <Wrapper>
      <StatusBar barStyle="dark-content" />
      <HeaderClose title={'Bendra informacija'} shadow={false} />
      <Formik
        initialValues={{
          airTemperature: 0,
          snowedHoursAgo: 0,
          snowThickness: 0,
        }}
        onSubmit={() => {}}
      >
        {({handleChange, handleSubmit, values}) => (
          <FormWrapper>
            <View>
              <Padding vertical={20} />
              <AmountInput
                allowNegativeValues
                onPress={delta => {
                  handleChange('airTemperature')(delta.toString());
                }}
                label="Oro temperatūra (°C):"
                value={Number(values.airTemperature)}
              />
              <Padding vertical={10} />
              <AmountInput
                allowNegativeValues
                onPress={delta => {
                  handleChange('snowedHoursAgo')(delta.toString());
                }}
                label="Snigo prieš (h):"
                value={Number(values.snowedHoursAgo)}
              />
              <Padding vertical={10} />
              <AmountInput
                onPress={delta => {
                  handleChange('snowThickness')(delta.toString());
                }}
                label="Sniego storis (cm):"
                value={Number(values.snowThickness)}
              />
            </View>
            <StartObservationButton
              variant={ButtonVariant.Secondary}
              text={'Pradėti'}
              onPress={() => {}}
            />
          </FormWrapper>
        )}
      </Formik>
    </Wrapper>
  );
};

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  flex-direction: column;
  background-color: white;
`;

const FormWrapper = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const StartObservationButton = styled(Button)`
  padding-horizontal: 30px;
`;

export default StartObservationModal;
