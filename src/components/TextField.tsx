import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import styled from 'styled-components';
import Text from './Text';

export enum Variant {
  regular = 'regular',
  light = 'light',
}

export interface TextFieldProps {
  variant?: Variant;
  label: string;
  onChangeText: (val: string) => void;
  value: string;
  style?: ViewStyle;
  error?: string;
  name: string;
  returnKeyType?: any;
  secureTextEntry?: any;
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
  keyboardType?: string;
  autoCapitalize?: string;
  optional?: boolean;
}

export interface Props
  extends ForwardRefExoticComponent<TextFieldProps & RefAttributes<any>> {
  Variant: typeof Variant;
}

// @ts-ignore
const TextField: Props = forwardRef(
  (
    {
      variant = Variant.regular,
      label = 'label',
      onChangeText = () => {},
      value = '',
      style,
      error,
      optional = true,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    return (
      <Container style={style}>
        <Label
          variant={
            variant === Variant.light
              ? Text.Variant.primaryLight
              : Text.Variant.primaryDark
          }
          weight={Text.Weight.medium}
          focused={focused}
        >
          {label}
          {!optional && (
            <OptionalStar
              variant={
                variant === Variant.light
                  ? Text.Variant.primaryLight
                  : Text.Variant.primaryDark
              }
            >
              *
            </OptionalStar>
          )}
        </Label>
        {/* @ts-ignore */}
        <StyledTextInput
          ref={ref}
          variant={variant}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          focused={focused}
          maxFontSizeMultiplier={1}
          {...rest}
        />
        {error ? <Error>{error}</Error> : null}
      </Container>
    );
  },
);

const Container = styled(View)`
  width: 100%;
`;

const Label = styled(Text.M)<{variant: string; focused: boolean}>`
  margin-bottom: 4px;
`;

const Error = styled(Text.S)`
  color: ${({theme}) => theme.colors.error};
`;

const StyledTextInput = styled(TextInput)<{variant: string; focused: boolean}>`
  padding: 0 0 0 10px;
  height: 40px;
  border-width: 1px;
  border-radius: 4px;
  border-color: ${({variant, theme}) =>
    variant === Variant.light
      ? theme.colors.primaryLight
      : theme.colors.primaryDark};

  background-color: ${({theme}) => theme.colors.almostWhite};
  color: ${({theme}) => theme.colors.primary};
`;

const OptionalStar = styled(Text.M)`
  vertical-align: top;
`;
TextField.Variant = Variant;

TextField.displayName = 'TextField';

export default TextField;
