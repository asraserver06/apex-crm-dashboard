import React from 'react';
import { Card, Typography, Tag, Progress } from 'antd';
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
  progressPercent?: number;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  trend,
  color = '#6366f1',
  progressPercent,
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      className="glass-card"
      style={{
        borderRadius: 16,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      bodyStyle={{ padding: '22px 24px' }}
    >
      {/* Decorative Top Accent Glow Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color} 0%, rgba(255,255,255,0) 100%)`,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span
              className="pulse-dot"
              style={{ backgroundColor: color }}
            />
            <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.2px' }}>
              {title}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            {prefix && <span style={{ fontSize: 22, fontWeight: 700, color }}>{prefix}</span>}
            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              {value}
            </Title>
            {suffix && <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{suffix}</Text>}
          </div>
        </div>

        {icon && (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `radial-gradient(circle at 30% 30%, ${color}25 0%, ${color}08 100%)`,
              border: `1px solid ${color}30`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: `0 8px 16px -4px ${color}20`,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {progressPercent !== undefined && (
        <div style={{ marginTop: 14 }}>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{ '0%': color, '100%': '#a855f7' }}
            size="small"
            style={{ margin: 0 }}
          />
        </div>
      )}

      {trend && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tag
            bordered={false}
            style={{
              borderRadius: 20,
              padding: '2px 10px',
              fontWeight: 700,
              fontSize: 12,
              margin: 0,
              background: trend.isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: trend.isPositive ? '#10b981' : '#ef4444',
            }}
          >
            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend.value)}%
          </Tag>

          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
            {trend.period || 'vs last month'}
          </Text>
        </div>
      )}
    </Card>
  );
};
