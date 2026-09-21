import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Customer,
  CustomerFilterParams,
  CreateCustomerInput,
  UpdateCustomerInput,
} from './customerTypes';
import type { PaginatedResponse, ApiResponse } from '../../types';

export const customerKeys = {
  all: ['customers'] as const,
  list: (params: CustomerFilterParams) => ['customers', 'list', params] as const,
  detail: (id: number) => ['customers', 'detail', id] as const,
};

// Fetch customers list with pagination, search, filter & sorting
export const useCustomers = (params: CustomerFilterParams) => {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: customerKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.status && params.status !== 'all') searchParams.append('status', params.status);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const res = await fetch(`/api/customers?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
  });
};

// Create customer mutation
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Customer>, Error, CreateCustomerInput>({
    mutationFn: async (newCustomer) => {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
      if (!res.ok) throw new Error('Failed to create customer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// Update customer mutation
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Customer>, Error, UpdateCustomerInput>({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update customer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

// Delete customer mutation
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
