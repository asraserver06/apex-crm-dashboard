import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Alert,
  Tooltip,
  Modal,
  notification,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { CustomerTable } from './CustomerTable';
import { CustomerFormDrawer } from './CustomerFormDrawer';
import { useCustomers, useDeleteCustomer } from './customerApi';
import type { Customer, CustomerStatus } from './customerTypes';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setCustomerSelectedRowKeys } from '../../layouts/uiSlice';

const { Option } = Select;

export const CustomersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customerSelectedRowKeys } = useAppSelector((state) => state.ui);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CustomerStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const deleteMutation = useDeleteCustomer();

  const { data, isLoading, isError, refetch } = useCustomers({
    page,
    pageSize,
    search,
    status,
    sortBy,
    sortOrder,
  });

  const handleOpenAddDrawer = () => {
    setCustomerToEdit(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCustomerToEdit(null);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, order: 'ascend' | 'descend') => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: `Delete ${customerSelectedRowKeys.length} Selected Customers?`,
      content: 'This action cannot be undone. Are you sure you want to remove these accounts?',
      okText: 'Delete Selected',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          for (const key of customerSelectedRowKeys) {
            await deleteMutation.mutateAsync(Number(key));
          }
          dispatch(setCustomerSelectedRowKeys([]));
          notification.success({
            message: 'Bulk Delete Complete',
            description: `Successfully deleted ${customerSelectedRowKeys.length} customers.`,
          });
        } catch {
          notification.error({
            message: 'Bulk Delete Failed',
            description: 'Could not complete deleting all selected records.',
          });
        }
      },
    });
  };

  const handleExportCSV = () => {
    if (!data?.data || data.data.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Company', 'Phone', 'Status', 'Lifetime Value', 'Created At'];
    const rows = data.data.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.company}"`,
      `"${c.phone || ''}"`,
      c.status,
      c.value || 0,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notification.success({
      message: 'Export Successful',
      description: 'Downloaded customer data as CSV.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Customers Directory"
        subtitle="Manage client accounts, sales leads, and lifetime revenues"
        breadcrumbs={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Customers' },
        ]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleOpenAddDrawer}
            style={{ borderRadius: 8 }}
          >
            Add New Customer
          </Button>
        }
      />

      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        bodyStyle={{ padding: 20 }}
      >
        {/* Search and Filters Header Toolbar */}
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
              placeholder="Search by name, email, or company..."
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 280, borderRadius: 8 }}
              size="middle"
            />

            <Select
              value={status}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
              style={{ width: 160 }}
              size="middle"
            >
              <Option value="all">All Statuses</Option>
              <Option value="active">Active Clients</Option>
              <Option value="lead">Sales Leads</Option>
              <Option value="inactive">Inactive</Option>
            </Select>

            <Tooltip title="Refresh dataset">
              <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
            </Tooltip>
          </Space>

          <Space size={12} wrap>
            {customerSelectedRowKeys.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                loading={deleteMutation.isPending}
              >
                Delete ({customerSelectedRowKeys.length})
              </Button>
            )}

            <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </Space>
        </div>

        {isError && (
          <Alert
            message="Error loading customers"
            description="Failed to load customer list from server. Click refresh to retry."
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <CustomerTable
          customers={data?.data || []}
          loading={isLoading}
          total={data?.total || 0}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onEdit={handleOpenEditDrawer}
          selectedRowKeys={customerSelectedRowKeys}
          onSelectRowChange={(keys) => dispatch(setCustomerSelectedRowKeys(keys))}
        />
      </Card>

      <CustomerFormDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        customerToEdit={customerToEdit}
      />
    </div>
  );
};

export default CustomersPage;
