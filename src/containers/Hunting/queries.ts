import {api} from '@root/apis/api';
import {useQuery} from '@tanstack/react-query';

// key factory
const huntingKeys = {
  all: ['hunting'] as const,
  geoPoints: () => [...huntingKeys.all, 'geoPoints'] as const,
  huntingGeoPoints: (huntingId: string) =>
    [...huntingKeys.geoPoints(), {huntingId}] as const,
};

export const useGeoPoints = (huntingId: string) => {
  return useQuery({
    queryKey: huntingKeys.huntingGeoPoints(huntingId),
    refetchOnWindowFocus: true,
    queryFn: () => api.getGeoPoints(huntingId),
  });
};
