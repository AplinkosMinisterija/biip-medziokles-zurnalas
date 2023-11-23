import React from 'react';
import {TextInput, TextInputProps, View, ViewStyle} from 'react-native';
import styled from 'styled-components';
import {getHeight} from '../utils/layout';
import Text from './Text';

export interface TextAreaProps extends TextInputProps {
  onChangeText: (val: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  error?: string;
  name?: string;
  returnKeyType?: any;
}

const TextArea: React.FC<TextAreaProps> = ({
  onChangeText,
  value = '',
  style,
  autoFocus = true,
  error,
  ...other
}) => {
  return (
    <View style={style}>
      <StyledTextInput
        {...other}
        onChangeText={onChangeText}
        value={value || ''}
        multiline={true}
        autoFocus={autoFocus}
        textAlignVertical="top"
        maxFontSizeMultiplier={1}
      />
      {error ? <Error>{error}</Error> : null}
    </View>
  );
};

const StyledTextInput = styled(TextInput)`
  padding: 16px 10px 16px 10px;
  border-width: 1px;
  border-radius: 4px;
  border-color: ${({theme}) => theme.colors.primaryLight};
  background-color: ${({theme}) => theme.colors.almostWhite};
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 16px;
  line-height: 22px;
  height: ${() => `${getHeight() / 3.6}px`};
`;

const Error = styled(Text.S)`
  color: ${({theme}) => theme.colors.error};
`;

export default TextArea;
