import React, { useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  notification,
} from 'antd';
import type { Customer, CustomerStatus } from './customerTypes';
import { useCreateCustomer, useUpdateCustomer } from './customerApi';

interface CustomerFormDrawerProps {
  open: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
}

const { Option } = Select;
const { TextArea } = Input;

export const CustomerFormDrawer: React.FC<CustomerFormDrawerProps> = ({
  open,
  onClose,
  customerToEdit,
}) => {
  const [form] = Form.useForm();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const isEditing = !!customerToEdit;

  useEffect(() => {
    if (open) {
      if (customerToEdit) {
        form.setFieldsValue({
          name: customerToEdit.name,
          email: customerToEdit.email,
          company: customerToEdit.company,
          phone: customerToEdit.phone || '',
          status: customerToEdit.status,
          value: customerToEdit.value || 0,
          notes: customerToEdit.notes || '',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 'active' as CustomerStatus,
          value: 10000,
        });
      }
    }
  }, [open, customerToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && customerToEdit) {
        await updateMutation.mutateAsync({
          id: customerToEdit.id,
          ...values,
        });
        notification.success({
          message: 'Customer Updated',
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        await createMutation.mutateAsync(values);
        notification.success({
          message: 'Customer Created',
          description: `${values.name} has been added to your CRM.`,
        });
      }

      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        notification.error({
          message: isEditing ? 'Failed to Update' : 'Failed to Create',
          description: (err as Error).message,
        });
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Drawer
      title={isEditing ? `Edit Customer: ${customerToEdit?.name}` : 'Create New Customer'}
      width={window.innerWidth < 576 ? '100%' : 480}
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit} loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Customer'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="e.g. Ali Khan" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input placeholder="e.g. ali@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company Name"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input placeholder="e.g. ABC Ltd" size="large" />
        </Form.Item>

        <Form.Item name="phone" label="Phone Number">
          <Input placeholder="e.g. +1 (555) 234-5678" size="large" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Account Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select size="large">
            <Option value="active">Active Client</Option>
            <Option value="lead">Sales Lead</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item name="value" label="Estimated Lifetime Value ($)">
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(val) => (val ? (Number(val.replace(/\$\s?|(,*)/g, '')) as any) : 0)}
            min={0}
            step={5000}
          />
        </Form.Item>

        <Form.Item name="notes" label="Notes & Background">
          <TextArea rows={4} placeholder="Key details, project preferences, or history..." />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
