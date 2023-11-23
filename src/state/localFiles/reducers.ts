import {compareDesc} from 'date-fns';
import update from 'immutability-helper';
import {Action, LocalFile} from '../types';
import {localFileActionType} from './actions';

export const INITIAL_FILE_STATE: LocalFile[] = [];

export const LocalFilesReducer = (
  state = INITIAL_FILE_STATE,
  action: Action,
) => {
  switch (action.type) {
    case localFileActionType.STATE_READ: {
      return action.payload;
    }
    case localFileActionType.STATE_ADD: {
      return update(state, {$push: [action.payload]}).sort((a, b) =>
        compareDesc(a.timestamp, b.timestamp),
      );
    }
    case localFileActionType.STATE_REMOVE: {
      const index = state.findIndex(file => file.path === action.payload);
      if (index !== -1) {
        return update(state, {$splice: [[index, 1]]});
      }
      return state;
    }
    default:
      return state;
  }
};
