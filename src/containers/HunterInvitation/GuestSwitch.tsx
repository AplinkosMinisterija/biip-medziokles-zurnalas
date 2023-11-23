import {NATIONALITY} from '@root/state/types';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import GlobeIcon from '../../components/svg/Globe';
import LTFlagIcon from '../../components/svg/LTFlag';
import Text from '../../components/Text';
import {strings} from '../../strings';

export enum OPTIONS {
  local = 'LOCAL',
  foreigner = 'FOREIGNER',
}

const GuestSwitch = ({value, onChange}: any) => {
  return (
    <Container>
      <Button
        selected={value === NATIONALITY.local}
        onPress={() => onChange(NATIONALITY.local)}
      >
        <LTFlagIcon />
        <Label
          variant={
            value === NATIONALITY.local
              ? Text.Variant.light
              : Text.Variant.primaryDark
          }
        >
          {strings.guest.lithuanian}
        </Label>
      </Button>
      <Button
        selected={value === NATIONALITY.foreigner}
        onPress={() => onChange(NATIONALITY.foreigner)}
      >
        <GlobeIcon />
        <Label
          variant={
            value === NATIONALITY.foreigner
              ? Text.Variant.light
              : Text.Variant.primaryDark
          }
        >
          {strings.guest.foreigner}
        </Label>
      </Button>
    </Container>
  );
};

const Container = styled(View)`
  background-color: ${({theme}) => theme.colors.primaryLight};
  border-radius: 8px;
  flex-direction: row;
`;

const Button = styled(TouchableOpacity)<{selected: boolean}>`
  background-color: ${({theme, selected}) =>
    selected ? theme.colors.primaryDark : 'transparent'};
  border-radius: 8px;
  height: 50px;
  width: 50%;
  padding: 0 12px;
  align-items: center;
  flex-direction: row;
`;

const Label = styled(Text.S)`
  margin-left: 8px;
`;

export default GuestSwitch;
