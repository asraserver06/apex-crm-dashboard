import { useQuery } from '@tanstack/react-query';
import type { AnalyticsSummary } from './analyticsTypes';
import type { ApiResponse } from '../../types';

export const useAnalyticsSummary = () => {
  return useQuery<ApiResponse<AnalyticsSummary>>({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/summary');
      if (!res.ok) throw new Error('Failed to fetch analytics metrics');
      return res.json();
    },
  });
};
