import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Table,
  Tag,
  Avatar,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  TrophyOutlined,
  RightOutlined,
  RocketOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { StatCard } from '../../components/common/StatCard';
import { useAnalyticsSummary } from '../analytics/analyticsApi';
import { useDeals } from '../deals/dealApi';
import { useCustomers } from '../customers/customerApi';
import { useAppSelector } from '../../app/store';
import { DealFormModal } from '../deals/DealFormModal';
import { CustomerFormDrawer } from '../customers/CustomerFormDrawer';

const { Title, Text, Paragraph } = Typography;

export const DashboardOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAnalyticsSummary();
  const { data: dealsData, isLoading: isDealsLoading } = useDeals({ page: 1, pageSize: 5, sortBy: 'value', sortOrder: 'descend' });
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({ page: 1, pageSize: 5 });

  const kpis = analyticsData?.data?.kpis;

  const dealColumns = [
    {
      title: 'Opportunity Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: { customerName?: string }) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
            {record.customerName || 'Client'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (val: number) => (
        <Text strong style={{ color: '#1677ff' }}>
          ${val ? val.toLocaleString() : 0}
        </Text>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        const color = stage === 'won' ? 'success' : stage === 'lost' ? 'error' : 'processing';
        return <Tag color={color}>{stage.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'closingDate',
      key: 'closingDate',
      render: (date: string) => <Text type="secondary" style={{ fontSize: 12 }}>{date}</Text>,
    },
  ];

  const customerColumns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: { company: string; email: string }) => (
        <Space size={10}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }} />
          <div>
            <Text strong style={{ fontSize: 13 }}>{text}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>{record.company}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Badge status={status === 'active' ? 'success' : 'processing'} text={status} />,
    },
  ];

  return (
    <div>
      {/* Sleek Welcome Banner */}
      <Card
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
          color: '#fff',
          marginBottom: 24,
          boxShadow: '0 10px 24px rgba(114, 46, 209, 0.25)',
          border: 'none',
        }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Space align="center" size={10} style={{ marginBottom: 4 }}>
              <RocketOutlined style={{ fontSize: 24, color: '#ffd666' }} />
              <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                Welcome back, {user?.name || 'Alex'}!
              </Title>
            </Space>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', margin: 0, fontSize: 14 }}>
              Apex CRM pipeline is performing strong. You have {kpis?.activeDeals || 0} active deals with a ${kpis?.totalDealValue.toLocaleString() || '0'} projected revenue pipeline.
            </Paragraph>
          </div>

          <Space wrap size={12}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setIsCustomerDrawerOpen(true)}
              style={{
                borderRadius: 8,
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Add Customer
            </Button>
            <Button
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsDealModalOpen(true)}
              style={{
                borderRadius: 8,
                background: '#fff',
                color: '#1677ff',
                border: 'none',
                fontWeight: 600,
              }}
            >
              Create Deal
            </Button>
          </Space>
        </div>
      </Card>

      {/* Primary KPI Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Revenue Value"
            value={`$${kpis?.totalDealValue.toLocaleString() || '0'}`}
            icon={<DollarOutlined />}
            color="#1677ff"
            trend={{ value: 12.5, isPositive: true }}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Customers"
            value={kpis?.activeCustomers || 0}
            icon={<UsergroupAddOutlined />}
            color="#722ed1"
            trend={{ value: 8.4, isPositive: true }}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Won Deal Volume"
            value={`$${kpis?.wonDealValue.toLocaleString() || '0'}`}
            icon={<TrophyOutlined />}
            color="#52c41a"
            trend={{ value: 19.3, isPositive: true }}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pipeline Conversion Rate"
            value={`${kpis?.conversionRate || 0}%`}
            icon={<RocketOutlined />}
            color="#faad14"
            trend={{ value: 3.8, isPositive: true }}
            loading={isAnalyticsLoading}
          />
        </Col>
      </Row>

      {/* Recent High-Value Deals & Top Customers Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            title="Top Value Pipeline Opportunities"
            extra={
              <Button type="link" onClick={() => navigate('/deals')} icon={<RightOutlined />}>
                View All Deals
              </Button>
            }
            style={{ borderRadius: 12, height: '100%' }}
            bodyStyle={{ padding: 12 }}
          >
            <Table
              columns={dealColumns}
              dataSource={dealsData?.data || []}
              rowKey="id"
              pagination={false}
              loading={isDealsLoading}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card
            title="Recent Accounts"
            extra={
              <Button type="link" onClick={() => navigate('/customers')} icon={<RightOutlined />}>
                View Customers
              </Button>
            }
            style={{ borderRadius: 12, height: '100%' }}
            bodyStyle={{ padding: 12 }}
          >
            <Table
              columns={customerColumns}
              dataSource={customersData?.data || []}
              rowKey="id"
              pagination={false}
              loading={isCustomersLoading}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <DealFormModal
        open={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />

      <CustomerFormDrawer
        open={isCustomerDrawerOpen}
        onClose={() => setIsCustomerDrawerOpen(false)}
      />
    </div>
  );
};

export default DashboardOverviewPage;
