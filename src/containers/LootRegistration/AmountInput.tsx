import React from 'react';
import {Text as RNText, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import Text from '../../components/Text';

type AmountInputProps = {
  onPress: (val: number) => void;
  label: string;
  value: number;
};

const AmountInput = ({label, onPress, value}: AmountInputProps) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <InputContainer>
        <Button onPress={() => onPress(value - 1 > 0 ? value - 1 : 0)}>
          <Action>{'-'}</Action>
        </Button>
        <Amount>{value}</Amount>
        <Button onPress={() => onPress(value + 1)}>
          <Action>{'+'}</Action>
        </Button>
      </InputContainer>
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.almostWhite};
  padding: 16px;
  justify-content: space-between;
  align-items: center;
`;

const InputContainer = styled(View)`
  flex-direction: row;
  margin-right: 8px;
`;

const Action = styled(RNText)`
  font-size: 40px;
  line-height: 38px;
  color: ${({theme}) => theme.colors.primaryDark};
`;

const Amount = styled(Text.XL)`
  width: 70px;
  text-align: center;
`;

const Button = styled(TouchableOpacity)`
  height: 34px;
  width: 34px;
  align-items: center;
  border-radius: 8px;
  background-color: #00465033;
`;

const Label = styled(Text.S)`
  line-height: 22px;
  max-width: 50%;
  color: #658f98;
`;

export default AmountInput;
