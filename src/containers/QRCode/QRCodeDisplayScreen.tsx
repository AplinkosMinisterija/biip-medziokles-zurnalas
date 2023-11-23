import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {RouteProp} from '@react-navigation/native';
import HeaderBack from '@root/components/HeaderBack';
import {getQRHuntingData} from '@root/state/qrCode/grCodeSelectors';
import {getWidth} from '@root/utils/layout';
import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {RootStackParamList, routes} from '../Router';

type QRCodeDisplayRouteProp = RouteProp<
  RootStackParamList,
  routes.qrCodeDisplay
>;

interface Props {
  route: QRCodeDisplayRouteProp;
}

const QRCodeDisplayScreen: React.FC<Props> = ({route}) => {
  const qrData = useSelector(getQRHuntingData(route.params.huntingMemberId));

  const initialBrightness = useMemo(() => {
    return DeviceBrightness.getBrightnessLevel();
  }, []);

  useEffect(() => {
    const setBrightness = async () => {
      await DeviceBrightness.setBrightnessLevel(1);
    };
    setBrightness();
    return () => {
      initialBrightness.then(value => {
        DeviceBrightness.setBrightnessLevel(value);
      });
    };
  }, []);

  return (
    <Container>
      <HeaderBack title={'QR Kodas'} />
      <QRCode ecl={'L'} size={getWidth()} quietZone={10} value={qrData} />
    </Container>
  );
};

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

export default QRCodeDisplayScreen;
