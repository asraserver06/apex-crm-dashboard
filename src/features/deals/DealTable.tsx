import React from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Typography,
  Tooltip,
  notification,
  Badge,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Deal, DealStage, DealPriority } from './dealTypes';
import { useDeleteDeal } from './dealApi';

const { Text } = Typography;

interface DealTableProps {
  deals: Deal[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSortChange: (sortBy: string, sortOrder: 'ascend' | 'descend') => void;
  onEdit: (deal: Deal) => void;
  selectedRowKeys: React.Key[];
  onSelectRowChange: (selectedKeys: React.Key[]) => void;
}

export const DealTable: React.FC<DealTableProps> = ({
  deals,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onSortChange,
  onEdit,
  selectedRowKeys,
  onSelectRowChange,
}) => {
  const deleteMutation = useDeleteDeal();

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      notification.success({
        message: 'Deal Deleted',
        description: `"${title}" has been deleted from pipeline.`,
      });
    } catch {
      notification.error({
        message: 'Delete Failed',
        description: 'Failed to delete deal.',
      });
    }
  };

  const getStageTag = (stage: DealStage) => {
    switch (stage) {
      case 'prospect':
        return <Tag color="blue">Prospect</Tag>;
      case 'proposal':
        return <Tag color="purple">Proposal</Tag>;
      case 'negotiation':
        return <Tag color="warning">Negotiation</Tag>;
      case 'won':
        return <Tag color="success">Closed Won</Tag>;
      case 'lost':
        return <Tag color="error">Closed Lost</Tag>;
      default:
        return <Tag>{stage}</Tag>;
    }
  };

  const getPriorityBadge = (priority: DealPriority) => {
    switch (priority) {
      case 'high':
        return <Badge status="error" text="High" />;
      case 'medium':
        return <Badge status="warning" text="Medium" />;
      case 'low':
        return <Badge status="default" text="Low" />;
      default:
        return <Badge status="default" text={priority} />;
    }
  };

  const columns: ColumnsType<Deal> = [
    {
      title: 'Deal Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text: string, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
            Client: {record.customerName || 'Customer ID: ' + record.customerId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      sorter: true,
      render: (val: number) => (
        <Text strong style={{ color: '#1677ff', fontSize: 15 }}>
          <DollarOutlined style={{ marginRight: 2 }} />
          {val ? val.toLocaleString() : 0}
        </Text>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: DealStage) => getStageTag(stage),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: DealPriority) => getPriorityBadge(priority),
    },
    {
      title: 'Target Close Date',
      dataIndex: 'closingDate',
      key: 'closingDate',
      sorter: true,
      render: (date: string) => (
        <Text type="secondary">
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit Deal">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>

          <Popconfirm
            title="Delete Deal?"
            description={`Are you sure you want to delete "${record.title}"?`}
            onConfirm={() => handleDelete(record.id, record.title)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
          >
            <Tooltip title="Delete Deal">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: unknown
  ) => {
    const singleSorter = sorter as { field?: string; order?: 'ascend' | 'descend' };
    if (singleSorter.field && singleSorter.order) {
      onSortChange(singleSorter.field, singleSorter.order);
    }
    if (pagination.current && pagination.pageSize) {
      onPageChange(pagination.current, pagination.pageSize);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => onSelectRowChange(keys),
  };

  return (
    <Table
      columns={columns}
      dataSource={deals}
      rowKey="id"
      rowSelection={rowSelection}
      loading={loading}
      onChange={handleTableChange}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (totalCount) => `Total ${totalCount} deals`,
      }}
      scroll={{ x: 800 }}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
};
