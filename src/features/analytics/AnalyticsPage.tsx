import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, DatePicker, Segmented, Spin } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  TrophyOutlined,
  BarChartOutlined,
  FundOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { useAnalyticsSummary } from './analyticsApi';
import { useAppSelector } from '../../app/store';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const STAGE_COLORS: Record<string, string> = {
  Prospect: '#1677ff',
  Proposal: '#722ed1',
  Negotiation: '#faad14',
  Won: '#52c41a',
  Lost: '#ff4d4f',
};

const PRIORITY_COLORS = ['#52c41a', '#faad14', '#ff4d4f'];

export const AnalyticsPage: React.FC = () => {
  const { themeMode } = useAppSelector((state) => state.ui);
  const isDark = themeMode === 'dark';

  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');
  const { data, isLoading } = useAnalyticsSummary();

  const analytics = data?.data;
  const kpis = analytics?.kpis;

  const textColor = isDark ? '#e2e8f0' : '#334155';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <div>
      <PageHeader
        title="Analytics & Financial Forecasting"
        subtitle="In-depth analysis of sales performance, conversion rates, and revenue trends"
        breadcrumbs={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Analytics' },
        ]}
        extra={
          <Space>
            <Segmented
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
              ]}
              value={timeframe}
              onChange={(val) => setTimeframe(val as 'monthly' | 'quarterly')}
            />
            <RangePicker style={{ width: 240 }} />
          </Space>
        }
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Calculating analytics analytics metrics..." />
        </div>
      ) : (
        <>
          {/* Executive KPI Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total CRM Revenue"
                value={`$${kpis?.totalDealValue.toLocaleString() || '0'}`}
                icon={<DollarOutlined />}
                color="#1677ff"
                trend={{ value: 14.2, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Closed Won Revenue"
                value={`$${kpis?.wonDealValue.toLocaleString() || '0'}`}
                icon={<TrophyOutlined />}
                color="#52c41a"
                trend={{ value: 21.8, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Deal Conversion Rate"
                value={`${kpis?.conversionRate || 0}%`}
                icon={<FundOutlined />}
                color="#722ed1"
                trend={{ value: 4.5, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Avg Deal Value"
                value={`$${kpis?.avgDealSize.toLocaleString() || '0'}`}
                icon={<BarChartOutlined />}
                color="#faad14"
                trend={{ value: 3.1, isPositive: true }}
              />
            </Col>
          </Row>

          {/* Visualizations Grid */}
          <Row gutter={[16, 16]}>
            {/* Monthly Trend Area Chart */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <FundOutlined style={{ color: '#1677ff' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      Revenue & Deal Volume Trend
                    </Title>
                  </Space>
                }
                style={{ borderRadius: 12, height: '100%' }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics?.monthlyTrend || []}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1677ff" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#1677ff" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="month" stroke={textColor} fontSize={12} />
                      <YAxis
                        yAxisId="left"
                        stroke={textColor}
                        fontSize={12}
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <YAxis yAxisId="right" orientation="right" stroke={textColor} fontSize={12} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderRadius: 8,
                          border: `1px solid ${gridColor}`,
                        }}
                        formatter={(val: any, name: any) => [
                          name === 'revenue' ? `$${Number(val || 0).toLocaleString()}` : val,
                          name === 'revenue' ? 'Revenue ($)' : 'New Deals',
                        ]}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="revenue"
                        stroke="#1677ff"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="dealsCount"
                        name="dealsCount"
                        stroke="#52c41a"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDeals)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Deal Stage Distribution Donut Chart */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined style={{ color: '#722ed1' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      Stage Distribution
                    </Title>
                  </Space>
                }
                style={{ borderRadius: 12, height: '100%' }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div style={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={analytics?.stageDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="stage"
                      >
                        {(analytics?.stageDistribution || []).map((entry) => (
                          <Cell
                            key={`cell-${entry.stage}`}
                            fill={STAGE_COLORS[entry.stage] || '#8884d8'}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderRadius: 8,
                        }}
                        formatter={(value: any, _name: any, props: any) => [
                          `${value} deals ($${props?.payload?.value?.toLocaleString() || 0})`,
                          'Count',
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Custom Legend Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {(analytics?.stageDistribution || []).map((st) => (
                      <Text key={st.stage} style={{ fontSize: 11 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: STAGE_COLORS[st.stage] || '#8884d8',
                            marginRight: 4,
                          }}
                        />
                        {st.stage} ({st.count})
                      </Text>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>

            {/* Priority Distribution Bar Chart */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined style={{ color: '#faad14' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      Revenue by Priority Tier
                    </Title>
                  </Space>
                }
                style={{ borderRadius: 12 }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.priorityDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="priority" stroke={textColor} fontSize={12} />
                      <YAxis
                        stroke={textColor}
                        fontSize={12}
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderRadius: 8,
                        }}
                        formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, 'Pipeline Value']}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {(analytics?.priorityDistribution || []).map((_entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={PRIORITY_COLORS[idx % PRIORITY_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Account Growth Statistics */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined style={{ color: '#52c41a' }} />
                    <Title level={5} style={{ margin: 0 }}>
                      Account Acquisition Metrics
                    </Title>
                  </Space>
                }
                style={{ borderRadius: 12 }}
                bodyStyle={{ padding: '20px 24px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 260, alignItems: 'center' }}>
                  <div
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      textAlign: 'center',
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Total Active Clients
                    </Text>
                    <Title level={2} style={{ color: '#52c41a', margin: '8px 0 0' }}>
                      {kpis?.activeCustomers || 0}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Out of {kpis?.totalCustomers || 0} total accounts
                    </Text>
                  </div>

                  <div
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      textAlign: 'center',
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Active Opportunities
                    </Text>
                    <Title level={2} style={{ color: '#1677ff', margin: '8px 0 0' }}>
                      {kpis?.activeDeals || 0}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Deals in active pipeline
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
