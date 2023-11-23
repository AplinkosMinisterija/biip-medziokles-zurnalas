import React from 'react';
import Svg, {Path} from 'react-native-svg';

const Hamburger = ({color = '#457685'}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" fill={color} />
    </Svg>
  );
};

export default Hamburger;
