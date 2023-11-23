import {
  getExtendedLimitedAnimalsBySeason,
  getMyStats,
  getStatsByHuntingArea,
} from '@state/data/dataSelectors';
import {ExtendedLimitedAnimalData, State} from '@state/types';
import {map} from 'lodash';

export const getLimitedAnimasStatistics =
  (seasonId: string, huntingAreaId?: string) =>
  (
    state: State,
  ): {
    limited: ExtendedLimitedAnimalData[];
    unlimited: ExtendedLimitedAnimalData[];
  } => {
    const limitedAnimals = seasonId
      ? getExtendedLimitedAnimalsBySeason(seasonId)(state)
      : {limited: [], unlimited: []};
    const stats = huntingAreaId
      ? getStatsByHuntingArea(huntingAreaId)(state)
      : getMyStats(state);

    const limitedAnimalsStats = map(limitedAnimals.limited, la => {
      return {
        ...la,
        ...(la.id && stats && stats[la.id] && {stats: stats[la.id]}),
      };
    });
    const unlimitedAnimalsStats = map(limitedAnimals.unlimited, la => {
      return {
        ...la,
        ...(la.id && stats && stats[la.id] && {stats: stats[la.id]}),
      };
    });
    return {
      limited: limitedAnimalsStats,
      unlimited: unlimitedAnimalsStats,
    };
  };
