import React from 'react';
import { Card, Typography, Tag, Badge, Button, Space, notification } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  EditOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import type { Deal, DealStage } from './dealTypes';
import { useUpdateDeal } from './dealApi';

const { Text } = Typography;

interface DealKanbanBoardProps {
  deals: Deal[];
  loading: boolean;
  onEdit: (deal: Deal) => void;
}

const STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: 'prospect', label: 'Prospect / Lead', color: '#1677ff' },
  { key: 'proposal', label: 'Proposal Submitted', color: '#722ed1' },
  { key: 'negotiation', label: 'Negotiation', color: '#faad14' },
  { key: 'won', label: 'Closed Won', color: '#52c41a' },
  { key: 'lost', label: 'Closed Lost', color: '#ff4d4f' },
];

export const DealKanbanBoard: React.FC<DealKanbanBoardProps> = ({
  deals,
  loading,
  onEdit,
}) => {
  const updateMutation = useUpdateDeal();

  const handleStageMove = async (deal: Deal, direction: 'next' | 'prev') => {
    const currentIndex = STAGES.findIndex((s) => s.key === deal.stage);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= STAGES.length) return;

    const nextStage = STAGES[targetIndex].key;

    try {
      await updateMutation.mutateAsync({
        id: deal.id,
        stage: nextStage,
      });
      notification.success({
        message: 'Stage Updated',
        description: `Moved "${deal.title}" to ${STAGES[targetIndex].label}`,
      });
    } catch {
      notification.error({
        message: 'Move Failed',
        description: 'Failed to update deal stage.',
      });
    }
  };

  if (loading) {
    return <Card loading style={{ minHeight: 300, borderRadius: 12 }} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      {STAGES.map((stageInfo, colIdx) => {
        const stageDeals = deals.filter((d) => d.stage === stageInfo.key);
        const colTotalValue = stageDeals.reduce((acc, d) => acc + d.value, 0);

        return (
          <div
            key={stageInfo.key}
            style={{
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 12,
              padding: 12,
              border: `1px solid rgba(0,0,0,0.06)`,
              minHeight: 450,
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: `2px solid ${stageInfo.color}`,
              }}
            >
              <div>
                <Text strong style={{ fontSize: 14 }}>
                  {stageInfo.label}
                </Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                  ${colTotalValue.toLocaleString()} ({stageDeals.length})
                </Text>
              </div>
              <Badge count={stageDeals.length} style={{ backgroundColor: stageInfo.color }} />
            </div>

            {/* Deal Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stageDeals.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 0',
                    color: 'rgba(0,0,0,0.35)',
                    fontSize: 12,
                    border: '1px dashed rgba(0,0,0,0.1)',
                    borderRadius: 8,
                  }}
                >
                  No deals in stage
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    size="small"
                    hoverable
                    style={{ borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text strong style={{ fontSize: 13, display: 'block' }}>
                        {deal.title}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined style={{ fontSize: 12 }} />}
                        onClick={() => onEdit(deal)}
                      />
                    </div>

                    <Text type="secondary" style={{ fontSize: 11, display: 'block', margin: '4px 0 8px' }}>
                      {deal.customerName || `Client #${deal.customerId}`}
                    </Text>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: '#1677ff', fontSize: 14 }}>
                        <DollarOutlined /> {deal.value.toLocaleString()}
                      </Text>

                      {deal.priority === 'high' && (
                        <Tag color="error" style={{ margin: 0, fontSize: 10, borderRadius: 4 }}>
                          High
                        </Tag>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        paddingTop: 8,
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        <CalendarOutlined style={{ marginRight: 2 }} /> {deal.closingDate}
                      </Text>

                      <Space size={4}>
                        {colIdx > 0 && (
                          <Button
                            type="text"
                            size="small"
                            icon={<ArrowLeftOutlined style={{ fontSize: 10 }} />}
                            onClick={() => handleStageMove(deal, 'prev')}
                          />
                        )}
                        {colIdx < STAGES.length - 1 && (
                          <Button
                            type="text"
                            size="small"
                            icon={<ArrowRightOutlined style={{ fontSize: 10 }} />}
                            onClick={() => handleStageMove(deal, 'next')}
                          />
                        )}
                      </Space>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
