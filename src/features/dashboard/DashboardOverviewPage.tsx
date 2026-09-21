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
  ThunderboltOutlined,
  UserOutlined,
  ArrowUpOutlined,
  FireOutlined,
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
          <Text strong style={{ fontSize: 14 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
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
        <Text strong style={{ color: '#6366f1', fontSize: 15 }}>
          ${val ? val.toLocaleString() : 0}
        </Text>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        const color = stage === 'won' ? '#10b981' : stage === 'lost' ? '#ef4444' : '#6366f1';
        return (
          <Tag color={color} style={{ borderRadius: 12, fontWeight: 700, padding: '2px 10px' }}>
            {stage.toUpperCase()}
          </Tag>
        );
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
        <Space size={12}>
          <Avatar
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#a855f7',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
            }}
          />
          <div>
            <Text strong style={{ fontSize: 14 }}>{text}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{record.company}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'processing'}
          text={<Text style={{ fontWeight: 600, fontSize: 12 }}>{status}</Text>}
        />
      ),
    },
  ];

  return (
    <div>
      {/* Sleek Animated Gradient Hero Banner */}
      <Card
        className="glass-card"
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
          color: '#fff',
          marginBottom: 28,
          boxShadow: '0 20px 40px -15px rgba(67, 56, 202, 0.5)',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '32px 36px' }}
      >
        {/* Background Decorative Blur Spheres */}
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(168, 85, 247, 0.3)',
            filter: 'blur(60px)',
            top: -50,
            right: -50,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <Space align="center" size={10} style={{ marginBottom: 8 }}>
              <FireOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
              <Tag color="gold" style={{ borderRadius: 12, fontWeight: 700, padding: '2px 10px' }}>
                Q4 REVENUE BOOST
              </Tag>
            </Space>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Welcome back, {user?.name || 'Alex'}! 👋
            </Title>
            <Paragraph style={{ color: 'rgba(226, 232, 240, 0.85)', marginTop: 8, marginBottom: 0, fontSize: 15, maxWidth: 620 }}>
              Your sales velocity is up <strong style={{ color: '#34d399' }}>+18.5%</strong> this month. You have <strong style={{ color: '#fff' }}>{kpis?.activeDeals || 0} active opportunities</strong> valued at <strong style={{ color: '#fbbf24' }}>${kpis?.totalDealValue.toLocaleString() || '0'}</strong>.
            </Paragraph>
          </div>

          <Space wrap size={14}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setIsCustomerDrawerOpen(true)}
              style={{
                borderRadius: 12,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                fontWeight: 700,
                height: 46,
                padding: '0 24px',
              }}
            >
              Add Customer
            </Button>
            <Button
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={() => setIsDealModalOpen(true)}
              style={{
                borderRadius: 12,
                background: '#ffffff',
                color: '#4338ca',
                border: 'none',
                fontWeight: 700,
                height: 46,
                padding: '0 24px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
            >
              Create Opportunity
            </Button>
          </Space>
        </div>
      </Card>

      {/* Primary KPI Metrics */}
      <Row gutter={[18, 18]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Revenue Value"
            value={`$${kpis?.totalDealValue.toLocaleString() || '0'}`}
            icon={<DollarOutlined />}
            color="#6366f1"
            trend={{ value: 18.5, isPositive: true }}
            progressPercent={78}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Client Accounts"
            value={kpis?.activeCustomers || 0}
            icon={<UsergroupAddOutlined />}
            color="#a855f7"
            trend={{ value: 12.4, isPositive: true }}
            progressPercent={65}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Closed Won Volume"
            value={`$${kpis?.wonDealValue.toLocaleString() || '0'}`}
            icon={<TrophyOutlined />}
            color="#10b981"
            trend={{ value: 24.8, isPositive: true }}
            progressPercent={88}
            loading={isAnalyticsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Conversion Rate"
            value={`${kpis?.conversionRate || 0}%`}
            icon={<ArrowUpOutlined />}
            color="#f59e0b"
            trend={{ value: 5.2, isPositive: true }}
            progressPercent={kpis?.conversionRate || 40}
            loading={isAnalyticsLoading}
          />
        </Col>
      </Row>

      {/* Recent High-Value Deals & Top Customers Grid */}
      <Row gutter={[18, 18]}>
        <Col xs={24} lg={15}>
          <Card
            className="glass-card"
            title={
              <Space size={8}>
                <FireOutlined style={{ color: '#6366f1', fontSize: 18 }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Top Pipeline Opportunities</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/deals')} icon={<RightOutlined />} style={{ fontWeight: 600 }}>
                View All Deals
              </Button>
            }
            style={{ borderRadius: 16, height: '100%' }}
            bodyStyle={{ padding: 16 }}
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
            className="glass-card"
            title={
              <Space size={8}>
                <UserOutlined style={{ color: '#a855f7', fontSize: 18 }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Key Accounts</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/customers')} icon={<RightOutlined />} style={{ fontWeight: 600 }}>
                Directory
              </Button>
            }
            style={{ borderRadius: 16, height: '100%' }}
            bodyStyle={{ padding: 16 }}
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
