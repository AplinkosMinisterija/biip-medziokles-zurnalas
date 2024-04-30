import Text from '@components/Text';
import React from 'react';
import styled from 'styled-components';
import {Center} from './layout';
import {Linking, Pressable} from 'react-native';

const PrivacyPolicyText: React.FC = () => {
  return (
    <Pressable
      onPress={() =>
        Linking.openURL('https://medziokle.biip.lt/privatumo-politika/')
      }
    >
      <Center>
        <VersionText>Privatumo politika</VersionText>
      </Center>
    </Pressable>
  );
};

const VersionText = styled(Text.XS)`
  color: ${({theme}) => theme.colors.primaryLight};
  padding-bottom: 6px;
`;

export default PrivacyPolicyText;
