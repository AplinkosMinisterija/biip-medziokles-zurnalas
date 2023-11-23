import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import Text from './Text';

interface AvatarProps {
  firstName: string;
  lastName: string;
  isManager: boolean;
  style?: any;
}

const Avatar = ({firstName, lastName, isManager, style}: AvatarProps) => {
  return (
    <MemberInitials highlight={!!isManager} style={style}>
      <Text.M variant={Text.Variant.light}>
        {`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
      </Text.M>
    </MemberInitials>
  );
};

const MemberInitials = styled(View)<{highlight: boolean}>`
  background-color: ${({highlight}) => (highlight ? '#006E82' : '#6EB4BE')};
  height: 40px;
  width: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

export default Avatar;
