import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const UpIcon = ({color = '#457685', size = 24, down = false, style}: any) => {
  return (
    <View style={style}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{transform: [{rotateX: down ? '180deg' : '0deg'}]}}
      >
        <Path
          d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default UpIcon;
