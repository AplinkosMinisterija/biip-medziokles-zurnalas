import {useIsFocused} from '@react-navigation/native';
import HeaderBack from '@root/components/HeaderBack';
import {Center} from '@root/components/layout';
import Text from '@root/components/Text';
import {localFileActions} from '@root/state/localFiles/actions';
import {theme} from '@root/theme';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';

const HEADER_TITLE = 'QR Skaitytuvas';

const CameraStateInvalidView: React.FC = ({children}) => (
  <>
    <HeaderBack title={HEADER_TITLE} />
    <FlexedView>{children}</FlexedView>
  </>
);

const QRCodeReaderScreen: React.FC = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const camera = useRef<Camera>(null);
  const [scanEnabled, setScanEnabled] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: false,
  });

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const showAlert = useCallback(
    (text: string, desc?: string) => {
      setScanEnabled(false);
      Alert.alert(text, desc, [
        {
          text: 'Gerai',
          onPress: () => setScanEnabled(true),
        },
      ]);
    },
    [setScanEnabled],
  );

  useEffect(() => {
    if (!scanEnabled) return;
    if (!barcodes || barcodes.length === 0) return;

    const barcode = barcodes[0];
    if (
      typeof barcode.content.data !== 'string' ||
      barcode.content.data.length === 0
    ) {
      showAlert('Klaidingas QR Kodas');
      return;
    }
    setScanEnabled(false);
    setTimeout(() => {
      setScanEnabled(true);
    }, 3000);
    dispatch(localFileActions.addLocalFile(barcode.content.data));
  }, [barcodes]);

  const devices = useCameraDevices();
  const device = devices.back;
  if (!hasPermission)
    return (
      <CameraStateInvalidView>
        <Text.M>Progamėlė neturi prieigos prie kameros</Text.M>
      </CameraStateInvalidView>
    );
  if (device == null)
    return (
      <CameraStateInvalidView>
        <ActivityIndicator size={'large'} color={theme.colors.primaryDark} />
      </CameraStateInvalidView>
    );
  return (
    <GestureHandlerRoot>
      <TapGestureHandler
        onHandlerStateChange={({nativeEvent}) => {
          camera.current?.focus({x: nativeEvent.x, y: nativeEvent.y});
        }}
      >
        {isFocused && (
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            isActive={isFocused}
            device={device}
            frameProcessor={isFocused ? frameProcessor : undefined}
            frameProcessorFps={2}
          />
        )}
      </TapGestureHandler>
      <HeaderBack title={HEADER_TITLE} />
    </GestureHandlerRoot>
  );
};

const GestureHandlerRoot = styled(GestureHandlerRootView)`
  flex: 1;
`;

const FlexedView = styled(Center)`
  flex: 1;
`;

export default QRCodeReaderScreen;
