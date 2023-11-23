import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {theme} from '../theme';
import CloseIcon from './svg/Close';
import Text from './Text';

const HeaderClose = ({title = '', onGoBack, shadow = true}: any) => {
  const navigation = useNavigation<any>();

  return (
    <Container shadow={shadow}>
      <Content>
        <Column>
          <Title>{title}</Title>
        </Column>
        <MenuButton
          onPress={onGoBack || navigation.goBack}
          hitSlop={{top: 15, bottom: 15, left: 30, right: 16}}
        >
          <CloseIcon color={theme.colors.primaryDark} />
        </MenuButton>
      </Content>
    </Container>
  );
};

const Container = styled(SafeAreaView)<{shadow: boolean}>`
  background-color: white;
  ${({theme, shadow}) => shadow && theme.shadow.light};
`;

const Content = styled(View)`
  display: flex;
  flex-direction: row;
  height: 60px;
  padding: 0 16px;
  align-items: center;
`;

const Column = styled(View)`
  flex: 1;
  align-items: center;
`;

const MenuButton = styled(TouchableOpacity)`
  justify-content: center;
`;

const Title = styled(Text.M)`
  color: ${({theme}) => theme.colors.primaryDark};
  padding: 0 0 0 24px;
`;

export default HeaderClose;
