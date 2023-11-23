import React from 'react';
import Svg, {Path} from 'react-native-svg';

const Checkbox = ({color = '#F89572'}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        fill={color}
      />
    </Svg>
  );
};

export default Checkbox;
