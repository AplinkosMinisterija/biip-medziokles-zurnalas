import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Callback as ImagePickerCallback} from 'react-native-image-picker/lib/typescript/types';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import styled from 'styled-components';
import CameraIcon from '../../components/svg/Camera';
import ImageIcon from '../../components/svg/Image';
import Text from '../../components/Text';
import {theme} from '../../theme';
import {isIOS} from '../../utils/layout';

const CameraPermissions = isIOS
  ? PERMISSIONS.IOS.CAMERA
  : PERMISSIONS.ANDROID.CAMERA;

const options = {
  mediaType: 'photo',
  includeBase64: true,
  maxWidth: 1024,
  maxHeight: 1024,
} as CameraOptions;

interface ImageSelectionProps {
  value: any;
  onChange: (val: string) => void;
  name?: string;
  error?: any;
  onPressPhoto?: () => void;
}

const ImageSelection = ({
  onPressPhoto,
  value = null,
  onChange,
  error,
}: ImageSelectionProps) => {
  const callback: ImagePickerCallback = response => {
    if (!response || response.didCancel || !response.assets) return;
    const data = response.assets[0];
    if (data.base64 && data.type) {
      const img = `data:${data.type};base64,${data.base64}`;
      onChange(img);
    }
  };

  const handleTakePhoto = () => {
    check(CameraPermissions).then(status => {
      if (status === 'blocked') {
        openSettings();
      } else if (status === 'granted') {
        launchCamera(options, callback);
      } else {
        request(CameraPermissions).then(permissionStatus => {
          permissionStatus === 'granted' && launchCamera(options, callback);
        });
      }
    });
  };

  const handleSelectFromLibrary = () => {
    launchImageLibrary(options, callback);
  };

  return (
    <Container>
      <PhotoButtons>
        <ButtonWrapper margin="0 4px 0 0" onPress={handleSelectFromLibrary}>
          <ImageIcon color={theme.colors.primaryDark} size={24} />
        </ButtonWrapper>
        <ButtonWrapper margin="0 0 0 4px" onPress={handleTakePhoto}>
          <CameraIcon color={theme.colors.primaryDark} size={24} />
        </ButtonWrapper>
        {error && !value ? <Error>{error}</Error> : null}
      </PhotoButtons>
      {value ? (
        <TouchableOpacity onPress={onPressPhoto}>
          <Img
            source={{
              uri: value,
            }}
          />
        </TouchableOpacity>
      ) : null}
    </Container>
  );
};

const Container = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
`;

const PhotoButtons = styled(View)`
  flex-direction: row;
`;

const ButtonWrapper = styled(TouchableOpacity)<{margin: string}>`
  height: 50px;
  width: 50px;
  background-color: ${({theme}) => theme.colors.primaryUltraLight};
  margin: ${({margin}) => margin || ''};
  border-radius: 4px;
  justify-content: center;
  align-items: center;
`;

const Img = styled(Image)`
  height: 50px;
  width: 50px;
  border-radius: 4px;
  background-color: ${({theme}) => theme.colors.primaryUltraLight};
  margin: 0 0 0 4px;
`;

const Error = styled(Text.S)`
  color: ${({theme}) => theme.colors.error};
  padding-left: 8px;
`;

export default ImageSelection;
