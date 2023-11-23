import {theme} from '@root/theme';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const WarningTriangleIcon = ({
  color = theme.colors.primaryLight,
  size = 24,
  style,
}: {
  color?: string;
  size?: number;
  style?: ViewStyle;
}) => {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default WarningTriangleIcon;
