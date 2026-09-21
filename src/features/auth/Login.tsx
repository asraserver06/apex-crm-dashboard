import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Alert,
  Space,
  Divider,
  notification,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../app/store';
import { setCredentials } from './authSlice';
import type { LoginCredentials } from './authTypes';

const { Title, Text, Paragraph } = Typography;

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Dispatch to Redux store
      dispatch(
        setCredentials({
          user: data.data.user,
          token: data.data.token,
        })
      );

      notification.success({
        message: 'Welcome back!',
        description: `Successfully signed in as ${data.data.user.name}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });

      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'admin' | 'manager') => {
    if (role === 'admin') {
      form.setFieldsValue({
        email: 'alex.mercer@apexcorp.com',
        password: 'Password123!',
        remember: true,
      });
    } else {
      form.setFieldsValue({
        email: 'sarah.manager@apexcorp.com',
        password: 'Password123!',
        remember: true,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Blur Spheres */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(22, 119, 255, 0.15)',
          filter: 'blur(80px)',
          top: -100,
          left: -100,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(114, 46, 209, 0.15)',
          filter: 'blur(80px)',
          bottom: -100,
          right: -100,
        }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
        bodyStyle={{ padding: '36px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 28,
              boxShadow: '0 8px 20px rgba(114, 46, 209, 0.4)',
              marginBottom: 16,
            }}
          >
            <RocketOutlined />
          </div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
            Apex CRM
          </Title>
          <Paragraph style={{ color: '#94a3b8', marginTop: 4, marginBottom: 0 }}>
            Enterprise Customer Relationship Portal
          </Paragraph>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMsg(null)}
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        <Form
          form={form}
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<Text style={{ color: '#cbd5e1', fontWeight: 500 }}>Email Address</Text>}
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#64748b' }} />}
              placeholder="alex.mercer@apexcorp.com"
              size="large"
              style={{ borderRadius: 8, background: '#0f172a', borderColor: '#334155', color: '#fff' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text style={{ color: '#cbd5e1', fontWeight: 500 }}>Password</Text>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#64748b' }} />}
              placeholder="••••••••••••"
              size="large"
              style={{ borderRadius: 8, background: '#0f172a', borderColor: '#334155', color: '#fff' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#94a3b8' }}>Remember me</Checkbox>
            </Form.Item>
            <a style={{ color: '#38bdf8', fontSize: 13 }} onClick={() => notification.info({ message: 'Demo mode active. Use quick login buttons below.' })}>
              Forgot password?
            </a>
          </div>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                borderRadius: 8,
                height: 44,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1677ff 0%, #2563eb 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ borderColor: '#334155', color: '#64748b', fontSize: 12 }}>
          QUICK DEMO ACCESSIBILITY
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="dashed"
            block
            onClick={() => handleDemoFill('admin')}
            style={{ color: '#38bdf8', borderColor: '#0284c7', borderRadius: 8 }}
          >
            Quick Fill Demo Admin Account
          </Button>
          <Button
            type="dashed"
            block
            onClick={() => handleDemoFill('manager')}
            style={{ color: '#c084fc', borderColor: '#9333ea', borderRadius: 8 }}
          >
            Quick Fill Demo Manager Account
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
