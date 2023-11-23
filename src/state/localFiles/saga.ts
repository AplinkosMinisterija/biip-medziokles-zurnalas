import {
  generatePDF,
  readDirectory,
  removeFile,
} from '@root/utils/localFileManager';
import {goBack} from '@root/utils/navigation';
import {decompressJSON} from '@utils/jsonCompress';
import FileViewer from 'react-native-file-viewer';
import {call, delay, put, takeLatest} from 'redux-saga/effects';
import {appActions} from '../app/actions';
import {syncActions} from '../sync/actions';
import {Action, LocalFile, QRMinifiedData} from '../types';
import {localFileActions, localFileActionType} from './actions';

function* handleReadLocalFiles() {
  try {
    yield put(syncActions.setOnSync.localFiles(true));
    const files: LocalFile[] = yield call(readDirectory);
    yield put(localFileActions.readStateLocalFiles(files));
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.localFiles(false));
  }
}

function* handleAddLocalFile(action: Action) {
  try {
    yield put(syncActions.setOnSync.localFiles(true));
    const qrData = decompressJSON(action.payload) as QRMinifiedData;
    const file: LocalFile = yield generatePDF(qrData);
    yield put(localFileActions.addStateLocalFile(file));
    yield call(goBack);
    yield delay(100);
    yield FileViewer.open(file.path);
  } catch (e) {
    yield put(appActions.handleError(e));
  } finally {
    yield put(syncActions.setOnSync.localFiles(false));
  }
}

function* handleRemoveLocalFile(action: Action) {
  try {
    yield removeFile(action.payload);
    yield put(localFileActions.removeStateLocalFile(action.payload));
  } catch (e) {
    yield put(appActions.handleError(e));
  }
}

export function* LocalFilesSaga() {
  yield takeLatest(localFileActionType.READ, handleReadLocalFiles);
  yield takeLatest(localFileActionType.ADD, handleAddLocalFile);
  yield takeLatest(localFileActionType.REMOVE, handleRemoveLocalFile);
}
