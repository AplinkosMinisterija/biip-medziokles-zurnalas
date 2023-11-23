import React from 'react';
import {View, ViewStyle} from 'react-native';
import styled from 'styled-components';
import Button from './Button';

interface ButtonConfig {
  action: () => void;
  loading?: boolean;
  text: string;
  disabled?: boolean;
}

interface ButtonFooterProps {
  primaryButton: ButtonConfig;
  secondaryButton?: ButtonConfig;
  style?: ViewStyle;
}

const ButtonFooter = ({
  primaryButton,
  secondaryButton,
  style,
}: ButtonFooterProps) => {
  return (
    <FooterContainer style={style}>
      {!!secondaryButton && (
        <SecondaryButton
          variant={Button.Variant.Transparent}
          disabled={secondaryButton.disabled}
          loading={secondaryButton.loading}
          text={secondaryButton.text}
          onPress={secondaryButton.action}
        />
      )}
      <PrimaryButton
        variant={Button.Variant.PrimaryDark}
        disabled={primaryButton.disabled}
        loading={primaryButton.loading}
        text={primaryButton.text}
        onPress={primaryButton.action}
      />
    </FooterContainer>
  );
};

const FooterContainer = styled(View)`
  flex-direction: row;
  padding: 18px 16px 0 16px;
  padding-bottom: ${({theme}) => `${theme.footer}px`};
  background-color: white;
  ${({theme}) => theme.shadow.light}
`;

const SecondaryButton = styled(Button)`
  flex: 1;
`;

const PrimaryButton = styled(Button)`
  flex: 1;
`;

export default ButtonFooter;
