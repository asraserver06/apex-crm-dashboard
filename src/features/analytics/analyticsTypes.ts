export interface KpiMetrics {
  totalCustomers: number;
  activeCustomers: number;
  totalDeals: number;
  activeDeals: number;
  totalDealValue: number;
  wonDealValue: number;
  conversionRate: number;
  avgDealSize: number;
}

export interface MonthlyTrendData {
  month: string;
  revenue: number;
  dealsCount: number;
  newCustomers: number;
}

export interface StageDistributionData {
  stage: string;
  count: number;
  value: number;
}

export interface PriorityDistributionData {
  priority: string;
  count: number;
  value: number;
}

export interface AnalyticsSummary {
  kpis: KpiMetrics;
  monthlyTrend: MonthlyTrendData[];
  stageDistribution: StageDistributionData[];
  priorityDistribution: PriorityDistributionData[];
}
