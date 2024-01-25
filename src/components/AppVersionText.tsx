import Text from '@components/Text';
import {DEV_OR_STG, __ENV__} from '@root/config';
import React, {useMemo} from 'react';
import DeviceInfo from 'react-native-device-info';
import styled from 'styled-components';
import {Center} from './layout';

const AppVersionText: React.FC = () => {
  const version = useMemo(
    () =>
      `Versija ${DeviceInfo.getVersion()} ${
        DEV_OR_STG ? `(${__ENV__.toLowerCase()})` : ''
      } `,
    [],
  );
  return (
    <Center>
      <VersionText>{version}</VersionText>
    </Center>
  );
};

const VersionText = styled(Text.XS)`
  color: ${({theme}) => theme.colors.primaryLight};
  padding-bottom: 6px;
`;

export default AppVersionText;
