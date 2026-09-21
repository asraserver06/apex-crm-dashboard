import React from 'react';
import { Typography, Breadcrumb, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  extra,
}) => {
  return (
    <div
      style={{
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            title: item.path ? <Link to={item.path}>{item.title}</Link> : item.title,
          }))}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 14 }}>
              {subtitle}
            </Text>
          )}
        </div>
        {extra && <Space wrap>{extra}</Space>}
      </div>
    </div>
  );
};
