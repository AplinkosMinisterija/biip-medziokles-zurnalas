import {QueryClient} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      staleTime: 1000 * 20, // 20 seconds
      retry: 2,
    },
  },
});

export default queryClient;
