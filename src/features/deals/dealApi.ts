import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Deal,
  DealFilterParams,
  CreateDealInput,
  UpdateDealInput,
} from './dealTypes';
import type { PaginatedResponse, ApiResponse } from '../../types';

export const dealKeys = {
  all: ['deals'] as const,
  list: (params: DealFilterParams) => ['deals', 'list', params] as const,
  detail: (id: number) => ['deals', 'detail', id] as const,
};

export const useDeals = (params: DealFilterParams) => {
  return useQuery<PaginatedResponse<Deal>>({
    queryKey: dealKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.stage && params.stage !== 'all') searchParams.append('stage', params.stage);
      if (params.priority && params.priority !== 'all') searchParams.append('priority', params.priority);
      if (params.customerId) searchParams.append('customerId', params.customerId.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const res = await fetch(`/api/deals?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch deals');
      return res.json();
    },
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Deal>, Error, CreateDealInput>({
    mutationFn: async (newDeal) => {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeal),
      });
      if (!res.ok) throw new Error('Failed to create deal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Deal>, Error, UpdateDealInput>({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update deal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete deal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
