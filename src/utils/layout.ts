import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const isIOS = Platform.OS === 'ios';
export const hasNotch = DeviceInfo.hasNotch();

export const getWidth = () => Dimensions.get('window').width;

export const getHeight = () => Dimensions.get('window').height;
