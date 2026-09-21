import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  ConfigProvider,
  theme as antTheme,
  Badge,
  Input,
  Tooltip,
  Modal,
  notification,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/store';
import { toggleSider, toggleTheme } from './uiSlice';
import { logout } from '../features/auth/authSlice';
import { clearAuthSession } from '../mocks/db';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { themeMode, siderCollapsed, primaryColor } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const isDark = themeMode === 'dark';

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/deals',
      icon: <DollarOutlined />,
      label: 'Deals Pipeline',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Log out of CRM Admin?',
      content: 'Are you sure you want to log out of your session?',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(logout());
        clearAuthSession();
        notification.success({
          message: 'Logged out successfully',
          description: 'You have been signed out of your account.',
        });
        navigate('/login');
      },
    });
  };

  const userMenuItems = [
    {
      key: 'profile-info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0' }}>
          <Text strong style={{ display: 'block' }}>
            {user?.name || 'Admin User'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email || 'admin@apexcorp.com'}
          </Text>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Log out',
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={siderCollapsed}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken && !siderCollapsed) {
              dispatch(toggleSider());
            }
          }}
          style={{
            background: isDark ? '#141414' : '#001529',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            zIndex: 10,
          }}
          width={240}
        >
          {/* Logo Brand Header */}
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: siderCollapsed ? 'center' : 'flex-start',
              padding: siderCollapsed ? '0' : '0 20px',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
              gap: 12,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(114, 46, 209, 0.4)',
              }}
            >
              <RocketOutlined />
            </div>
            {!siderCollapsed && (
              <div>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: '0.5px',
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  APEX CRM
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 10 }}>
                  ENTERPRISE v2.4
                </Text>
              </div>
            )}
          </div>

          {/* Sider Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              paddingTop: 12,
              background: 'transparent',
              borderRight: 0,
            }}
          />
        </Sider>

        <Layout>
          {/* Main Top Header */}
          <Header
            style={{
              padding: '0 24px',
              background: isDark ? '#1f1f1f' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 1px 4px rgba(0, 0, 0, 0.5)'
                : '0 1px 4px rgba(0, 21, 41, 0.08)',
              zIndex: 9,
              height: 64,
            }}
          >
            <Space size={16}>
              <Button
                type="text"
                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => dispatch(toggleSider())}
                style={{ fontSize: 16 }}
              />
              <Input
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                placeholder="Search deals, customers..."
                style={{ width: 220, borderRadius: 20 }}
                variant="filled"
              />
            </Space>

            <Space size={16}>
              {/* Theme Toggle Button */}
              <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
                <Button
                  type="text"
                  shape="circle"
                  icon={isDark ? <SunOutlined style={{ color: '#faad14' }} /> : <MoonOutlined />}
                  onClick={() => dispatch(toggleTheme())}
                  style={{ fontSize: 18 }}
                />
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <Badge count={3} offset={[-2, 4]} size="small">
                  <Button type="text" shape="circle" icon={<BellOutlined />} style={{ fontSize: 18 }} />
                </Badge>
              </Tooltip>

              {/* User Dropdown */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Space style={{ cursor: 'pointer', paddingLeft: 8 }}>
                  <Avatar
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div style={{ display: 'none', minWidth: 80 }}>
                    <Text strong style={{ display: 'block', lineHeight: 1.2 }}>
                      {user?.name || 'Admin'}
                    </Text>
                  </div>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Main Body Content */}
          <Content
            style={{
              margin: '24px 24px 0',
              padding: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>

          {/* Footer */}
          <Layout.Footer
            style={{
              textAlign: 'center',
              padding: '16px 24px',
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
              fontSize: 13,
            }}
          >
            Apex CRM Dashboard ©2026 Created with Ant Design & Redux Toolkit
          </Layout.Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
