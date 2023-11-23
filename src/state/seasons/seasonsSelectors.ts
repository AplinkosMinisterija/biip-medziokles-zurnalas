import {isAfter, isBefore} from 'date-fns';
import {find, values} from 'lodash';
import {createSelector} from 'reselect';
import {getSeasons} from '../data/dataSelectors';
import {SeasonData} from '../types';

export const getAvailableSeasons = createSelector(
  getSeasons,
  (seasons): SeasonData[] => {
    return values(seasons);
  },
);

export const getCurrentSeason = createSelector(
  getSeasons,
  (seasons): SeasonData => {
    const today = new Date();
    const availableSeasons = values(seasons);
    return (
      find(
        availableSeasons,
        (season: SeasonData) =>
          isAfter(today, new Date(season.startDate)) &&
          isBefore(today, new Date(season.endDate)),
      ) || availableSeasons[availableSeasons.length]
    );
  },
);
