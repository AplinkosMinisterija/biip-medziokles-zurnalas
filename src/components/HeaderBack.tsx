import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import {Center} from './layout';
import BackIcon from './svg/Back';
import Text from './Text';

interface Props {
  title: string;
  onGoBack?: () => void;
  renderRightItem?: () => React.ReactNode;
  onRightItemPress?: () => void;
}

const HeaderBack: React.FC<Props> = ({
  title = '',
  onGoBack,
  renderRightItem,
  onRightItemPress,
}) => {
  const navigation = useNavigation<any>();

  return (
    <Container>
      <Content>
        <SideIconContainer>
          <SideIconPressable onPress={onGoBack || navigation.goBack}>
            <BackIcon color={theme.colors.primaryDark} size={24} />
          </SideIconPressable>
        </SideIconContainer>
        <Center>
          <Title>{title}</Title>
        </Center>
        <SideIconContainer>
          {renderRightItem && onRightItemPress && (
            <SideIconPressable onPress={onRightItemPress}>
              {renderRightItem && renderRightItem()}
            </SideIconPressable>
          )}
        </SideIconContainer>
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)`
  ${({theme}) => theme.shadow.light};
  background-color: white;
`;

const Content = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
`;

const SideIconContainer = styled(Center)`
  // background-color: cyan;
  width: 50px;
`;

const SideIconPressable = styled(Pressable)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Title = styled(Text.M)`
  color: ${({theme}) => theme.colors.primaryDark};
  font-size: 16px;
`;

export default HeaderBack;
