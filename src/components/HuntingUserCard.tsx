import UserCard, {UserCardProps} from '@components/UserCard';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components';

interface HuntingUserCardProps extends UserCardProps {
  onPress: () => void;
  isLast?: boolean;
  activeOpacity?: number;
  leftHunting?: boolean;
}
const HuntingUserCard: React.FC<HuntingUserCardProps> = ({
  isLast,
  onPress,
  activeOpacity,
  user,
  leftHunting = false,
  ...rest
}) => {
  return (
    <Container
      isLast={isLast}
      activeOpacity={activeOpacity}
      opacity={leftHunting ? 0.35 : 1}
      onPress={onPress}
    >
      <UserCard user={user} {...rest} />
    </Container>
  );
};

const Container = styled(TouchableOpacity)<{isLast?: boolean; opacity: number}>`
  display: flex;
  flex-direction: row;
  ${({theme}) => theme.shadow.light};
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  opacity: ${({opacity}) => opacity};
  margin: ${({isLast}) => `12px 14px ${isLast ? 14 : 0}px 14px`};
`;

export default HuntingUserCard;
