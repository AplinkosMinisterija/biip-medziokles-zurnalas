import {StatusBar} from 'react-native';
import {DefaultTheme} from 'styled-components';
import {hasNotch, isIOS} from './utils/layout';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      primaryLight: string;
      primaryDark15: string;
      primaryUltraLight: string;
      secondary: string;
      yellow: string;
      white: string;
      almostWhite: string;
      overlay: string;
      transparent: string;
      error: string;
      success: string;
      [key: string]: string;
    };
    shadow: any;
    header: number;
    footer: number;
    hitSlop: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    primary: '#457685',
    primaryDark: '#004650',
    primaryLight: '#A5B9C0',
    primaryDark15: '#0046501A',
    primaryUltraLight: '#D4DDDE',
    secondary: '#F89572',
    white: '#FFFFFF',
    almostWhite: '#F7F8FA',
    overlay: '#00000080',
    transparent: 'transparent',
    yellow: '#FCB500',
    error: '#ED5565',
    success: '#36B572',
  },
  shadow: {
    ultraLight: `
            shadow-color: #000;
            shadow-offset: 0;
            shadow-opacity: 0.2;
            shadow-radius: 2px;
            elevation: 2;
        `,
    light: `
            shadow-color: #000;
            shadow-offset: 0;
            shadow-opacity: 0.2;
            shadow-radius: 4px;
            elevation: 4;
        `,
  },
  header: isIOS ? (hasNotch ? 45 : 30) : Number(StatusBar.currentHeight) + 4,
  footer: hasNotch && isIOS ? 28 : 16,
  hitSlop: {top: 15, bottom: 15, left: 15, right: 15},
};
