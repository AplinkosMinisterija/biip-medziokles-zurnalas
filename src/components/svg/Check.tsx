import React from 'react';
import {View, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const CheckIcon = ({
  color = 'white',
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
          fill={color}
          d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
        />
      </Svg>
    </View>
  );
};

export default CheckIcon;
