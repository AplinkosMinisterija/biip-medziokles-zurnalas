import React from 'react';
import Svg, {Path} from 'react-native-svg';

const LTFlagIcon = ({size = 24}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M24 4C24 1.79086 22.2091 0 20 0H4C1.79086 0 0 1.79086 0 4V8H24V4Z"
        fill="#F6BB42"
      />
      <Path
        d="M24 16H0V20C0 22.2091 1.79086 24 4 24H20C22.2091 24 24 22.2091 24 20V16Z"
        fill="#ED5565"
      />
      <Path d="M24 8H0V16H24V8Z" fill="#57A863" />
    </Svg>
  );
};

export default LTFlagIcon;
