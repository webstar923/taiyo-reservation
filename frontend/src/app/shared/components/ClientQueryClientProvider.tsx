'use client';

import { QueryClient, QueryClientProvider, QueryClientConfig } from '@tanstack/react-query';
import React from 'react';

const ClientQueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Memoize the QueryClient to prevent re-initialization
  const queryClient = React.useMemo(() => {
    const config: QueryClientConfig = {
      defaultOptions: {
        queries: {
          retry: 2,
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
        },
        mutations: {
          onError: (error) => console.error('Mutation Error:', error),
        },
      },
    };
    return new QueryClient(config);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientQueryClientProvider;
