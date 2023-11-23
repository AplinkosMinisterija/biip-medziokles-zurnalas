import ButtonFooter from '@root/components/ButtonFooter';
import {LootCaseType} from '@root/state/types';
import {strings} from '@root/strings';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import ExtraCase from './ExtraCase';

interface Props {
  onBack: () => void;
  onPress: () => void;
  isLastStep: boolean;
  selectedCase: LootCaseType;
  setSelectedCase: (value: LootCaseType) => void;
  isExtraCase: boolean;
  setExtraCase: (value: boolean) => void;
}

const ExtraCaseStep: React.FC<Props> = ({
  onPress,
  onBack,
  isLastStep,
  selectedCase,
  setSelectedCase,
  isExtraCase,
  setExtraCase,
}) => {
  return (
    <Wrapper>
      <View>
        <ExtraCase
          selectedCase={selectedCase}
          setSelectedCase={setSelectedCase}
          isExtraCase={isExtraCase}
          setExtraCase={setExtraCase}
        />
      </View>

      <ButtonFooter
        style={{
          marginBottom: 0,
          position: 'relative',
          bottom: 0,
        }}
        primaryButton={{
          action: () => {
            onPress();
          },
          disabled: isExtraCase && selectedCase === LootCaseType.standard,
          text: isLastStep ? strings.common.save : strings.common.continue,
        }}
        secondaryButton={{
          action: onBack,
          text: strings.common.back,
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled(View)`
  padding-top: 16px;
  background-color: white;
  justify-content: space-between;
  flex-grow: 1;
`;

export default ExtraCaseStep;
