import React from 'react';
import Svg, {Path} from 'react-native-svg';

const RightIcon = ({color = '#457685', size = 24}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
        fill={color}
      />
    </Svg>
  );
};

export default RightIcon;
