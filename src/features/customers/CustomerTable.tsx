import React from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Avatar,
  Typography,
  Tooltip,
  notification,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Customer, CustomerStatus } from './customerTypes';
import { useDeleteCustomer } from './customerApi';

const { Text } = Typography;

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSortChange: (sortBy: string, sortOrder: 'ascend' | 'descend') => void;
  onEdit: (customer: Customer) => void;
  selectedRowKeys: React.Key[];
  onSelectRowChange: (selectedKeys: React.Key[]) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
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
  const deleteMutation = useDeleteCustomer();

  const handleDelete = async (id: number, name: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      notification.success({
        message: 'Customer Removed',
        description: `${name} was deleted successfully.`,
      });
    } catch {
      notification.error({
        message: 'Delete Failed',
        description: 'Failed to delete customer.',
      });
    }
  };

  const getStatusTag = (status: CustomerStatus) => {
    switch (status) {
      case 'active':
        return <Tag color="success">Active</Tag>;
      case 'lead':
        return <Tag color="processing">Sales Lead</Tag>;
      case 'inactive':
        return <Tag color="default">Inactive</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (_, record) => (
        <Space size={12}>
          <Avatar
            src={record.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.name}`}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1677ff' }}
          />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      sorter: true,
      render: (company: string) => <Text style={{ fontWeight: 500 }}>{company}</Text>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) =>
        phone ? (
          <Text type="secondary" style={{ fontSize: 13 }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {phone}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Sales Lead', value: 'lead' },
        { text: 'Inactive', value: 'inactive' },
      ],
      render: (status: CustomerStatus) => getStatusTag(status),
    },
    {
      title: 'Lifetime Value',
      dataIndex: 'value',
      key: 'value',
      sorter: true,
      render: (val?: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${val ? val.toLocaleString() : '0'}
        </Text>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit Customer">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Customer?"
            description={`Are you sure you want to delete ${record.name}?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
          >
            <Tooltip title="Delete Customer">
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
      dataSource={customers}
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
        showTotal: (totalCount) => `Total ${totalCount} customers`,
      }}
      scroll={{ x: 800 }}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    />
  );
};
