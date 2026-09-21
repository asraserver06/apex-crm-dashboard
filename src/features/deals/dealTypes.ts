import type { BaseQueryParams } from '../../types';

export type DealStage = 'prospect' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: number;
  title: string;
  customerId: number;
  customerName?: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  closingDate: string;
  createdAt: string;
  notes?: string;
}

export interface DealFilterParams extends BaseQueryParams {
  stage?: DealStage | 'all';
  priority?: DealPriority | 'all';
  customerId?: number;
  startDate?: string;
  endDate?: string;
}

export type CreateDealInput = Omit<Deal, 'id' | 'createdAt' | 'customerName'>;
export type UpdateDealInput = Partial<CreateDealInput> & { id: number };
