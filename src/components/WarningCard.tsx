import Text from '@components/Text';
import {theme} from '@root/theme';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import styled from 'styled-components';
import WarningTriangleIcon from './svg/WarningTriangle';

interface Props {
  style?: StyleProp<ViewStyle>;
  text?: string;
  multiline?: boolean;
}

const WarningCard: React.FC<Props> = ({style, text, multiline = false}) => {
  return (
    <Container style={style}>
      <WarningIcon multiline={multiline} color={theme.colors.secondary} />
      {text && <Title>{text}</Title>}
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  min-height: 40px;
  flex-direction: row;
  align-items: flex-start;
  padding-horizontal: 10px;
  padding-vertical: 10px;
  background-color: ${theme.colors.secondary}29;
  border: 1px;
  border-color: ${theme.colors.secondary};
  border-radius: 5px;
`;

const Title = styled(Text.M)`
  flex: 1;
  padding-left: 10px;
  line-height: 20px;
  align-self: center;
`;

const WarningIcon = styled(WarningTriangleIcon)<{multiline: boolean}>`
  margin-top: ${({multiline}) => (multiline ? '5px' : '0')};
`;

export default WarningCard;
