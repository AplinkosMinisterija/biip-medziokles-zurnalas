import React from 'react';
import {View, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const BackIcon = ({
  color = 'white',
  size = 24,
  style,
  back = true,
}: {
  color?: string;
  size?: number;
  style?: ViewStyle;
  back?: boolean;
}) => {
  return (
    <View style={style}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{transform: [{rotateY: back ? '0deg' : '180deg'}]}}
      >
        <Path
          d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default BackIcon;
