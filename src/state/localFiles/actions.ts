import {LocalFile} from '../types';

export const localFileActionType = {
  READ: 'localFiles_READ',
  ADD: 'localFiles_ADD',
  REMOVE: 'localFiles_REMOVE',
  STATE_READ: 'localFiles_STATE_READ',
  STATE_ADD: 'localFiles_STATE_ADD',
  STATE_REMOVE: 'localFiles_STATE_REMOVE',
};

export const localFileActions = {
  readLocalFiles: () => ({
    type: localFileActionType.READ,
  }),
  addLocalFile: (payload: string) => ({
    type: localFileActionType.ADD,
    payload,
  }),
  removeLocalFile: (filePath: string) => ({
    type: localFileActionType.REMOVE,
    payload: filePath,
  }),
  readStateLocalFiles: (files: LocalFile[]) => ({
    type: localFileActionType.STATE_READ,
    payload: files,
  }),
  addStateLocalFile: (payload: LocalFile) => ({
    type: localFileActionType.STATE_ADD,
    payload,
  }),
  removeStateLocalFile: (filePath: string) => ({
    type: localFileActionType.STATE_REMOVE,
    payload: filePath,
  }),
};
