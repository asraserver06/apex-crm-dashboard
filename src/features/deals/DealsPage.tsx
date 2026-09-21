import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Segmented,
  Row,
  Col,
  Modal,
  notification,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  TableOutlined,
  AppstoreOutlined,
  DeleteOutlined,
  DollarOutlined,
  TrophyOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { DealTable } from './DealTable';
import { DealKanbanBoard } from './DealKanbanBoard';
import { DealFormModal } from './DealFormModal';
import { useDeals, useDeleteDeal } from './dealApi';
import type { Deal, DealStage, DealPriority } from './dealTypes';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setDealSelectedRowKeys } from '../../layouts/uiSlice';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const DealsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dealSelectedRowKeys } = useAppSelector((state) => state.ui);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<DealStage | 'all'>('all');
  const [priority, setPriority] = useState<DealPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);

  const deleteMutation = useDeleteDeal();

  const { data, isLoading, refetch } = useDeals({
    page: viewMode === 'kanban' ? 1 : page,
    pageSize: viewMode === 'kanban' ? 100 : pageSize,
    search,
    stage,
    priority,
    sortBy,
    sortOrder,
  });

  const dealsList = data?.data || [];

  // Summary Metrics calculations
  const totalPipelineValue = dealsList.reduce((acc, d) => acc + d.value, 0);
  const wonDeals = dealsList.filter((d) => d.stage === 'won');
  const wonValue = wonDeals.reduce((acc, d) => acc + d.value, 0);
  const avgDealValue = dealsList.length > 0 ? Math.round(totalPipelineValue / dealsList.length) : 0;

  const handleOpenAddModal = () => {
    setDealToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDealToEdit(null);
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: `Delete ${dealSelectedRowKeys.length} Selected Deals?`,
      content: 'Are you sure you want to delete these deals from your pipeline?',
      okText: 'Delete Selected',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          for (const key of dealSelectedRowKeys) {
            await deleteMutation.mutateAsync(Number(key));
          }
          dispatch(setDealSelectedRowKeys([]));
          notification.success({
            message: 'Bulk Delete Complete',
            description: `Successfully deleted ${dealSelectedRowKeys.length} deals.`,
          });
        } catch {
          notification.error({
            message: 'Bulk Delete Failed',
            description: 'Could not complete deleting selected deals.',
          });
        }
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Deals & Sales Pipeline"
        subtitle="Track opportunities, stages, deal values, and closing forecasts"
        breadcrumbs={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Deals Pipeline' },
        ]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAddModal}
            style={{ borderRadius: 8 }}
          >
            Create New Deal
          </Button>
        }
      />

      {/* KPI Stats Bar */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pipeline Value"
            value={`$${totalPipelineValue.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#1677ff"
            trend={{ value: 18.5, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Active Opportunities"
            value={data?.total || dealsList.length}
            icon={<FieldTimeOutlined />}
            color="#722ed1"
            trend={{ value: 8.2, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Closed Won Revenue"
            value={`$${wonValue.toLocaleString()}`}
            icon={<TrophyOutlined />}
            color="#52c41a"
            trend={{ value: 24.1, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Average Deal Size"
            value={`$${avgDealValue.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#faad14"
            trend={{ value: 5.4, isPositive: true }}
          />
        </Col>
      </Row>

      {/* Main Card with Filter Toolbar & Views */}
      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        bodyStyle={{ padding: 20 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Space size={12} wrap style={{ flex: 1 }}>
            <Input
              placeholder="Search deals by title or customer..."
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 260, borderRadius: 8 }}
            />

            <Select
              value={stage}
              onChange={(val) => {
                setStage(val);
                setPage(1);
              }}
              style={{ width: 150 }}
            >
              <Option value="all">All Stages</Option>
              <Option value="prospect">Prospect</Option>
              <Option value="proposal">Proposal</Option>
              <Option value="negotiation">Negotiation</Option>
              <Option value="won">Closed Won</Option>
              <Option value="lost">Closed Lost</Option>
            </Select>

            <Select
              value={priority}
              onChange={(val) => {
                setPriority(val);
                setPage(1);
              }}
              style={{ width: 140 }}
            >
              <Option value="all">All Priorities</Option>
              <Option value="high">High Priority</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low Priority</Option>
            </Select>

            <RangePicker style={{ width: 230 }} placeholder={['Start Date', 'Closing Date']} />

            <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
          </Space>

          <Space size={12}>
            {dealSelectedRowKeys.length > 0 && viewMode === 'table' && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                loading={deleteMutation.isPending}
              >
                Delete ({dealSelectedRowKeys.length})
              </Button>
            )}

            <Segmented
              options={[
                { value: 'table', icon: <TableOutlined /> },
                { value: 'kanban', icon: <AppstoreOutlined /> },
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as 'table' | 'kanban')}
            />
          </Space>
        </div>

        {viewMode === 'table' ? (
          <DealTable
            deals={dealsList}
            loading={isLoading}
            total={data?.total || 0}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
            onEdit={handleOpenEditModal}
            selectedRowKeys={dealSelectedRowKeys}
            onSelectRowChange={(keys) => dispatch(setDealSelectedRowKeys(keys))}
          />
        ) : (
          <DealKanbanBoard
            deals={dealsList}
            loading={isLoading}
            onEdit={handleOpenEditModal}
          />
        )}
      </Card>

      <DealFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        dealToEdit={dealToEdit}
      />
    </div>
  );
};

export default DealsPage;
