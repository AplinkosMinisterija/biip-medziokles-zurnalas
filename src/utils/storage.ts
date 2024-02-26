import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import FilesystemStorage from 'redux-persist-filesystem-storage';

const storage = Platform.OS === 'ios' ? AsyncStorage : FilesystemStorage;

export default storage;
