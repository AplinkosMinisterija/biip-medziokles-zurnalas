import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';
import CloseButton from './CloseButton';
import Text from './Text';

const ActionsModal = ({title, children, wrap, scrollable = false}: any) => {
  const navigation = useNavigation<any>();

  return (
    <Container>
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <Overlay />
      </TouchableWithoutFeedback>
      <InnerWrapper>
        <Content wrap={wrap}>
          <StyledCloseButton onPress={navigation.goBack} />
          {title && <Title>{title}</Title>}
          {scrollable ? <ScrollView>{children}</ScrollView> : children}
        </Content>
      </InnerWrapper>
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Overlay = styled(View)<any>`
  width: 100%;
  height: 100%;
  background-color: ${({theme}) => theme.colors.overlay};
`;

const InnerWrapper = styled(View)`
  max-height: 92%;
  margin-top: auto;
  overflow: hidden;
`;

const Content = styled(View)<{wrap: boolean}>`
  background-color: white;
  margin-top: auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-bottom: ${({theme}) => `${theme.footer + 16}px`};
  max-height: 100%;
`;

const Title = styled(Text.M)`
  padding: 0 16px 16px 16px;
  text-align: center;
  font-weight: 600;
`;

const StyledCloseButton = styled(CloseButton)`
  margin-left: auto;
  padding: 24px;
`;

export default ActionsModal;
