import Text from '@components/Text';
import ButtonFooter from '@root/components/ButtonFooter';
import {strings} from '@root/strings';
import {useKeyboard} from '@root/utils/hooks';
import {isIOS} from '@root/utils/layout';
import React, {useState} from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';
import HuntingNotes from '../NewHunting/HuntingNotes';

interface Props {
  onBack: () => void;
  onPress: (val: string) => void;
  isLastStep: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  isRequired?: boolean;
}

const Commentary: React.FC<Props> = ({
  onBack,
  onPress,
  isLastStep,
  disabled = false,
  loading = false,
  isRequired = false,
  error,
}) => {
  const openKeyboard = useKeyboard();
  const [comment, setComment] = useState('');
  const [isRequiredError, setIsRequiredError] = useState('');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Wrapper>
        <View>
          <Heading weight={Text.Weight.regular}>Įvykio aplinkybės</Heading>
          <HuntingNotes
            autoFocus={false}
            error={error ?? isRequiredError}
            placeholder={`Patvirtinus, šio teksto vėliau nebus galima keisti, tačiau bus galima papildyti`}
            onChangeText={setComment}
            notes={comment}
          />
        </View>
        <ButtonFooter
          style={{
            marginBottom: !isIOS && openKeyboard ? 22 : 0,
            position: !isIOS && openKeyboard ? 'absolute' : 'relative',
            bottom: 0,
          }}
          primaryButton={{
            disabled,
            loading,
            action: () => {
              if (isRequired && comment === '') {
                setIsRequiredError('Privalomas laukas');
              } else {
                onPress(comment);
              }
            },
            text: isLastStep ? strings.common.save : strings.common.continue,
          }}
          secondaryButton={{
            action: onBack,
            text: strings.common.back,
          }}
        />
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

const Heading = styled(Text.Heading)`
  margin: 0px 22px 24px 22px;
`;

const Wrapper = styled(View)`
  padding-top: 16px;
  background-color: white;
  justify-content: space-between;
  flex-grow: 1;
`;

export default Commentary;
