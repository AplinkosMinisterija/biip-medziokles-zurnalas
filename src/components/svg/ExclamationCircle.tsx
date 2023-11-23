import {theme} from '@root/theme';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

const ExclamationCircleIcon = ({
  color = theme.colors.primaryLight,
  exclamationColor = 'white',
  size = 24,
  style,
}: {
  color?: string;
  exclamationColor?: string;
  size?: number;
  style?: ViewStyle;
}) => {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="12" fill={color} />
        <Path
          d="M13.4191 5.37144L13.1698 14.5376H10.8303L10.5746 5.37144H13.4191ZM12 19.6285C11.5782 19.6285 11.216 19.4794 10.9134 19.1811C10.6108 18.8785 10.4617 18.5163 10.466 18.0945C10.4617 17.6768 10.6108 17.3189 10.9134 17.0206C11.216 16.7223 11.5782 16.5731 12 16.5731C12.4049 16.5731 12.7607 16.7223 13.0675 17.0206C13.3743 17.3189 13.5299 17.6768 13.5341 18.0945C13.5299 18.3757 13.4553 18.6335 13.3104 18.8679C13.1698 19.098 12.9844 19.2834 12.7543 19.424C12.5242 19.5604 12.2728 19.6285 12 19.6285Z"
          fill={exclamationColor}
        />
      </Svg>
    </View>
  );
};

export default ExclamationCircleIcon;
