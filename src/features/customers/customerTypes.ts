import type { BaseQueryParams } from '../../types';

export type CustomerStatus = 'active' | 'lead' | 'inactive';

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: CustomerStatus;
  value?: number;
  avatar?: string;
  notes?: string;
  createdAt: string;
}

export interface CustomerFilterParams extends BaseQueryParams {
  status?: CustomerStatus | 'all';
}

export type CreateCustomerInput = Omit<Customer, 'id' | 'createdAt'>;
export type UpdateCustomerInput = Partial<CreateCustomerInput> & { id: number };
