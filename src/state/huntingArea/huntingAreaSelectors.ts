import {getSelectedHuntingArea} from '../app/appSelectors';
import {
  ExtendedHuntingAreaData,
  getExtendedHuntingArea,
} from '../data/dataSelectors';
import {State} from '../types';

export const getSelectedHuntingAreaData = (
  state: State,
): ExtendedHuntingAreaData | undefined => {
  const selectedHuntingArea = getSelectedHuntingArea(state);
  if (selectedHuntingArea) {
    return getExtendedHuntingArea(selectedHuntingArea)(state);
  }
  return undefined;
};
