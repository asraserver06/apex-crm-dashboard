import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: React.ReactNode;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  color?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  color = '#1677ff',
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      hoverable
      style={{
        borderRadius: 12,
        height: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: `1px solid rgba(0, 0, 0, 0.06)`,
        overflow: 'hidden',
      }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
            {title}
          </Text>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {prefix && <span style={{ fontSize: 20, fontWeight: 600, color }}>{prefix}</span>}
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              {value}
            </Title>
            {suffix && <Text type="secondary" style={{ fontSize: 14 }}>{suffix}</Text>}
          </div>
        </div>
        {icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag
            color={trend.isPositive ? 'success' : 'error'}
            style={{ borderRadius: 6, padding: '0 8px', fontWeight: 600, margin: 0 }}
          >
            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend.value)}%
          </Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {trend.period || 'vs last month'}
          </Text>
        </div>
      )}
    </Card>
  );
};
