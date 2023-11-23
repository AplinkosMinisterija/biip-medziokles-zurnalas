import React, {ReactNode} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components';

export enum ButtonVariant {
  Primary = 'primary',
  PrimaryDark = 'primaryDark',
  PrimaryLight = 'primaryLight',
  Secondary = 'secondary',
  Transparent = 'transparent',
  Danger = 'error',
}

enum TextVariant {
  PrimaryDark = 'primaryDark',
  White = 'white',
  Secondary = 'secondary',
}

enum TextSizeVariant {
  M = 16,
  S = 14,
  XS = 12,
}

type ButtonProps = {
  onPress: () => void;
  text: string | null;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  textVariant?: TextVariant;
  textSizeVariant?: TextSizeVariant;
  leftIcon?: ReactNode;
  width?: string;
  style?: ViewStyle;
  textStyle?: any;
  buttonStyle?: ViewStyle;
};

const Button = ({
  text = '',
  onPress,
  leftIcon,
  loading = false,
  disabled = false,
  width = '100%',
  variant = ButtonVariant.Primary,
  style,
  textVariant,
  textSizeVariant,
  textStyle,
  buttonStyle,
}: ButtonProps) => {
  const contentColor = textVariant
    ? textVariant
    : variant === ButtonVariant.Transparent
    ? TextVariant.PrimaryDark
    : TextVariant.White;

  return (
    <View style={style}>
      <CustomButton
        variant={variant}
        style={buttonStyle}
        width={width}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={contentColor} />
        ) : (
          <>
            {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
            <ButtonText
              color={contentColor}
              style={textStyle}
              textSize={textSizeVariant || Button.TextSizeVariant.M}
              maxFontSizeMultiplier={1}
            >
              {text}
            </ButtonText>
          </>
        )}
      </CustomButton>
    </View>
  );
};

const CustomButton = styled(TouchableOpacity)<{
  variant: string;
  width: string;
  disabled: boolean;
}>`
  background-color: ${({theme, variant}) => theme.colors[variant]};
  width: ${({width}) => width};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  height: 40px;
  flex-direction: row;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const ButtonText = styled(Text)<{color: string; textSize: number}>`
  color: ${({theme, color}) => theme.colors[color]};
  font-size: ${({textSize}) => `${textSize}px`};
  font-weight: 500;
`;

const IconWrapper = styled(View)`
  margin-right: 4px;
`;

Button.Variant = ButtonVariant;
Button.TextVariant = TextVariant;
Button.TextSizeVariant = TextSizeVariant;
export default Button;
