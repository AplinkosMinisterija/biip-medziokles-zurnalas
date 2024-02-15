import {api, HuntingEventsProps} from '@root/apis/api';
import {useInfiniteQuery} from '@tanstack/react-query';

// hunt event key factory
const huntEventKeys = {
  all: ['huntEvent'] as const,
  list: (props: HuntingEventsProps) => [...huntEventKeys.all, {props}] as const,
};

// to infinity and beyond!
export const useInfiniteHuntEvents = (props: HuntingEventsProps) => {
  return useInfiniteQuery({
    queryKey: [huntEventKeys.list(props)],
    queryFn: ({pageParam}) =>
      api.getHuntingEvents({
        ...props,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages) => {
      const {page, totalPages} = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
