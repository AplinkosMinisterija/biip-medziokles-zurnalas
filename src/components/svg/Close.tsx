import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CloseIcon = ({color = '#A4A7BD', size = 24}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        fill={color}
      />
    </Svg>
  );
};

export default CloseIcon;
