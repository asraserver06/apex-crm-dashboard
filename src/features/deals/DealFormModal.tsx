import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Radio,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import type { Deal, DealStage, DealPriority } from './dealTypes';
import { useCreateDeal, useUpdateDeal } from './dealApi';
import { useCustomers } from '../customers/customerApi';

interface DealFormModalProps {
  open: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
}

const { Option } = Select;
const { TextArea } = Input;

export const DealFormModal: React.FC<DealFormModalProps> = ({
  open,
  onClose,
  dealToEdit,
}) => {
  const [form] = Form.useForm();
  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();

  const { data: customerData } = useCustomers({ pageSize: 100 });
  const customersList = customerData?.data || [];

  const isEditing = !!dealToEdit;

  useEffect(() => {
    if (open) {
      if (dealToEdit) {
        form.setFieldsValue({
          title: dealToEdit.title,
          customerId: dealToEdit.customerId,
          value: dealToEdit.value,
          stage: dealToEdit.stage,
          priority: dealToEdit.priority,
          closingDate: dealToEdit.closingDate ? dayjs(dealToEdit.closingDate) : null,
          notes: dealToEdit.notes || '',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          stage: 'prospect' as DealStage,
          priority: 'medium' as DealPriority,
          value: 25000,
          closingDate: dayjs().add(30, 'day'),
        });
      }
    }
  }, [open, dealToEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        closingDate: values.closingDate ? values.closingDate.format('YYYY-MM-DD') : '',
      };

      if (isEditing && dealToEdit) {
        await updateMutation.mutateAsync({
          id: dealToEdit.id,
          ...payload,
        });
        notification.success({
          message: 'Deal Updated',
          description: `"${values.title}" has been updated.`,
        });
      } else {
        await createMutation.mutateAsync(payload);
        notification.success({
          message: 'Deal Created',
          description: `New deal "${values.title}" added to pipeline.`,
        });
      }

      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        notification.error({
          message: isEditing ? 'Failed to Update Deal' : 'Failed to Create Deal',
          description: (err as Error).message,
        });
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEditing ? `Edit Deal: ${dealToEdit?.title}` : 'Create New Pipeline Deal'}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={isSubmitting}
      okText={isEditing ? 'Save Deal' : 'Create Deal'}
      width={window.innerWidth < 576 ? '95%' : 560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="title"
          label="Deal Title"
          rules={[{ required: true, message: 'Please enter deal title' }]}
        >
          <Input placeholder="e.g. Enterprise SaaS Expansion" size="large" />
        </Form.Item>

        <Form.Item
          name="customerId"
          label="Associated Customer / Client"
          rules={[{ required: true, message: 'Please select a customer' }]}
        >
          <Select
            showSearch
            placeholder="Select a customer from directory..."
            size="large"
            optionFilterProp="children"
          >
            {customersList.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="value"
          label="Deal Value ($)"
          rules={[{ required: true, message: 'Please enter deal value' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            formatter={(val) => `$ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(val) => (val ? (Number(val.replace(/\$\s?|(,*)/g, '')) as any) : 0)}
            min={0}
            step={5000}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="stage"
            label="Pipeline Stage"
            rules={[{ required: true, message: 'Please select deal stage' }]}
          >
            <Select size="large">
              <Option value="prospect">Discovery / Prospect</Option>
              <Option value="proposal">Proposal Submitted</Option>
              <Option value="negotiation">Negotiation</Option>
              <Option value="won">Closed Won</Option>
              <Option value="lost">Closed Lost</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority Level"
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Radio.Group buttonStyle="solid" size="large">
              <Radio.Button value="low">Low</Radio.Button>
              <Radio.Button value="medium">Med</Radio.Button>
              <Radio.Button value="high">High</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item
          name="closingDate"
          label="Target Closing Date"
          rules={[{ required: true, message: 'Please select closing date' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item name="notes" label="Notes & Contract Terms">
          <TextArea rows={3} placeholder="Key requirements, decision maker details, terms..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
