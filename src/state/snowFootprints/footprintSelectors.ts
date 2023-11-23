import {getUser} from '../data/dataSelectors';
import {
  ExtendedFootprintObservation,
  FootprintObservation,
  State,
} from '../types';

export const getFootprintObservations = (
  state: State,
): {[key: string]: FootprintObservation} => {
  return state?.data?.footprintObservations?.$entities;
};

export const getFootprintObservationsByHuntingArea =
  (id: string) =>
  (state: State): string[] => {
    return state?.data?.footprintObservations?.byHuntingArea[id];
  };

export const getAllFootprintObservations = (
  state: State,
): ExtendedFootprintObservation[] | null => {
  if (state?.data?.footprintObservations?.$entities) {
    return Object.values(state?.data?.footprintObservations?.$entities).map(
      observation => {
        return {
          ...observation,
          createdBy: getUser(observation.createdBy)(state),
        };
      },
    );
  } else return null;
};
