import React from 'react';
import {Text as RNText, TextProps} from 'react-native';
import styled from 'styled-components';

export enum Weight {
  regular = 'normal',
  medium = '600',
  bold = 'bold',
}

export enum Variant {
  primary = 'primary',
  primaryDark = 'primaryDark',
  primaryLight = 'primaryLight',
  secondary = 'secondary',
  light = 'white',
  error = 'error',
}

export interface TextParam extends TextProps {
  variant?: Variant;
  weight?: Weight;
}

const TextComponent = (props: TextProps) => (
  <RNText maxFontSizeMultiplier={1} {...props} />
);

export const Heading = styled(TextComponent)<TextParam>`
  font-size: 20px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.bold};
`;

export const XL = styled(TextComponent)<TextParam>`
  font-size: 24px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.regular};
`;

export const L = styled(TextComponent)<TextParam>`
  font-size: 20px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.regular};
`;

export const M = styled(TextComponent)<TextParam>`
  font-size: 16px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.regular};
`;

export const S = styled(TextComponent)<TextParam>`
  font-size: 14px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.regular};
`;

export const XS = styled(TextComponent)<TextParam>`
  font-size: 12px;
  color: ${({theme, variant}) => theme.colors[variant || Variant.primaryDark]};
  font-weight: ${({weight}) => weight || Weight.regular};
`;

export default {
  XL,
  L,
  M,
  S,
  XS,
  Heading,
  Variant,
  Weight,
};
