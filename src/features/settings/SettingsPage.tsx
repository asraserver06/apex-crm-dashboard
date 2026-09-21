import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Space,
  Row,
  Col,
  Avatar,
  Divider,
  notification,
} from 'antd';
import {
  UserOutlined,
  BgColorsOutlined,
  BellOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setPrimaryColor, toggleTheme } from '../../layouts/uiSlice';

const { Title, Text } = Typography;

const COLOR_PRESETS = [
  { name: 'Apex Blue', hex: '#1677ff' },
  { name: 'Royal Purple', hex: '#722ed1' },
  { name: 'Emerald Green', hex: '#52c41a' },
  { name: 'Sunset Gold', hex: '#faad14' },
  { name: 'Crimson Rose', hex: '#f5222d' },
];

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { themeMode, primaryColor } = useAppSelector((state) => state.ui);

  const isDark = themeMode === 'dark';

  const handleSaveProfile = (_values: Record<string, unknown>) => {
    notification.success({
      message: 'Profile Updated',
      description: 'Your account settings have been saved successfully.',
    });
  };

  return (
    <div>
      <PageHeader
        title="Account & System Settings"
        subtitle="Manage user profile preferences, theme appearance, and alert notifications"
        breadcrumbs={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Settings' },
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: '#1677ff' }} />
                <span>User Profile & Organization</span>
              </Space>
            }
            style={{ borderRadius: 12, height: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <Avatar
                size={64}
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                icon={<UserOutlined />}
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {user?.name || 'Alex Mercer'}
                </Title>
                <Text type="secondary">{user?.email || 'alex.mercer@apexcorp.com'}</Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="success" style={{ fontWeight: 600, fontSize: 12 }}>
                    Role: {user?.role.toUpperCase() || 'ADMIN'}
                  </Text>
                </div>
              </div>
            </div>

            <Form
              layout="vertical"
              initialValues={{
                name: user?.name || 'Alex Mercer',
                email: user?.email || 'alex.mercer@apexcorp.com',
                department: user?.department || 'Enterprise Sales',
              }}
              onFinish={handleSaveProfile}
            >
              <Form.Item name="name" label="Display Name">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="email" label="Email Address">
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item name="department" label="Department / Division">
                <Input size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" style={{ borderRadius: 8 }}>
                Save Profile Changes
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Theme & Customization */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BgColorsOutlined style={{ color: '#722ed1' }} />
                <span>UI Theme & Branding</span>
              </Space>
            }
            style={{ borderRadius: 12, height: '100%' }}
          >
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Dark Mode Toggle
              </Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Switch between dark and light theme palettes</Text>
                <Switch
                  checked={isDark}
                  onChange={() => dispatch(toggleTheme())}
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                />
              </div>
            </div>

            <Divider />

            <div>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Primary Accent Color
              </Text>
              <Row gutter={[12, 12]}>
                {COLOR_PRESETS.map((color) => (
                  <Col key={color.hex} span={12}>
                    <div
                      onClick={() => {
                        dispatch(setPrimaryColor(color.hex));
                        notification.success({
                          message: 'Theme Accent Changed',
                          description: `Updated primary accent color to ${color.name}`,
                        });
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: `2px solid ${primaryColor === color.hex ? color.hex : 'rgba(0,0,0,0.1)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: primaryColor === color.hex ? `${color.hex}15` : 'transparent',
                      }}
                    >
                      <Space size={8}>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                          }}
                        />
                        <Text style={{ fontSize: 13, fontWeight: 500 }}>{color.name}</Text>
                      </Space>
                      {primaryColor === color.hex && <CheckOutlined style={{ color: color.hex }} />}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>

        {/* Notifications & Security */}
        <Col xs={24} span={24}>
          <Card
            title={
              <Space>
                <BellOutlined style={{ color: '#faad14' }} />
                <span>Notification & Alert Preferences</span>
              </Space>
            }
            style={{ borderRadius: 12 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ display: 'block' }}>Email Daily Pipeline Digest</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Receive daily summary of deal stage movements</Text>
                </div>
                <Switch defaultChecked />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ display: 'block' }}>High Value Deal Alerts</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Notify when a deal above $50,000 changes stage</Text>
                </div>
                <Switch defaultChecked />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ display: 'block' }}>New Customer Lead Notifications</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Alert when sales leads are added to directory</Text>
                </div>
                <Switch defaultChecked />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
