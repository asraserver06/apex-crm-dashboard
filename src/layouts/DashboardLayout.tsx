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
  Tag,
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
  ThunderboltOutlined,
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
      icon: <DashboardOutlined style={{ fontSize: 18 }} />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined style={{ fontSize: 18 }} />,
      label: 'Customers',
    },
    {
      key: '/deals',
      icon: <DollarOutlined style={{ fontSize: 18 }} />,
      label: 'Deals Pipeline',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined style={{ fontSize: 18 }} />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined style={{ fontSize: 18 }} />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Log out of Apex CRM?',
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
        <div style={{ padding: '6px 4px' }}>
          <Text strong style={{ display: 'block', fontSize: 14 }}>
            {user?.name || 'Alex Mercer'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email || 'alex.mercer@apexcorp.com'}
          </Text>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Preferences',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Sign out',
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
          borderRadius: 10,
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: isDark ? '#090d16' : '#f8fafc' }}>
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
            background: isDark ? '#0f172a' : '#0f172a',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
            zIndex: 10,
          }}
          width={250}
        >
          {/* Logo Brand Header */}
          <div
            style={{
              height: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: siderCollapsed ? 'center' : 'flex-start',
              padding: siderCollapsed ? '0' : '0 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              gap: 12,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 22,
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
              }}
            >
              <ThunderboltOutlined />
            </div>
            {!siderCollapsed && (
              <div>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: '-0.3px',
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  APEX CRM
                </Text>
                <Tag
                  color="purple"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    margin: 0,
                    borderRadius: 4,
                    padding: '0 4px',
                  }}
                >
                  PRO ENTERPRISE
                </Tag>
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
              paddingTop: 16,
              background: 'transparent',
              borderRight: 0,
            }}
          />
        </Sider>

        <Layout style={{ background: 'transparent' }}>
          {/* Main Top Header */}
          <Header
            style={{
              padding: '0 28px',
              background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: isDark
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(226, 232, 240, 0.8)',
              zIndex: 9,
              height: 70,
              position: 'sticky',
              top: 0,
            }}
          >
            <Space size={16}>
              <Button
                type="text"
                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => dispatch(toggleSider())}
                style={{ fontSize: 18 }}
              />
              <Input
                prefix={<SearchOutlined style={{ color: 'rgba(148, 163, 184, 0.8)' }} />}
                placeholder="Quick search customers, deals (Ctrl + K)..."
                style={{ width: 280, borderRadius: 20 }}
                variant="filled"
              />
            </Space>

            <Space size={20}>
              {/* Live Status Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} />
                <Text style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                  MSW SYNC ACTIVE
                </Text>
              </div>

              {/* Theme Toggle Button */}
              <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
                <Button
                  type="text"
                  shape="circle"
                  icon={isDark ? <SunOutlined style={{ color: '#fbbf24', fontSize: 18 }} /> : <MoonOutlined style={{ fontSize: 18 }} />}
                  onClick={() => dispatch(toggleTheme())}
                />
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <Badge count={3} offset={[-2, 4]} size="small">
                  <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} />
                </Badge>
              </Tooltip>

              {/* User Dropdown */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <Space style={{ cursor: 'pointer', paddingLeft: 4 }}>
                  <Avatar
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
                    icon={<UserOutlined />}
                    size={38}
                    style={{
                      backgroundColor: primaryColor,
                      border: '2px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    }}
                  />
                  <div style={{ display: 'none' }}>
                    <Text strong style={{ display: 'block', lineHeight: 1.2 }}>
                      {user?.name || 'Alex'}
                    </Text>
                  </div>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* Main Body Content */}
          <Content
            style={{
              margin: '28px 28px 0',
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
              padding: '24px',
              color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(100,116,139,0.7)',
              fontSize: 13,
            }}
          >
            Apex CRM Enterprise Dashboard • Built with React, TypeScript & Ant Design
          </Layout.Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
