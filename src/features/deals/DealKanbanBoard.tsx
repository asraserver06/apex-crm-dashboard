import React from 'react';
import { Card, Typography, Tag, Badge, Button, Space, notification, Tooltip } from 'antd';
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

const STAGES: { key: DealStage; label: string; color: string; gradient: string }[] = [
  { key: 'prospect', label: 'Prospect / Discovery', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
  { key: 'proposal', label: 'Proposal Sent', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
  { key: 'negotiation', label: 'Negotiation', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { key: 'won', label: 'Closed Won', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { key: 'lost', label: 'Closed Lost', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
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
        message: 'Pipeline Stage Updated',
        description: `Moved "${deal.title}" to ${STAGES[targetIndex].label}`,
      });
    } catch {
      notification.error({
        message: 'Update Failed',
        description: 'Failed to update deal stage.',
      });
    }
  };

  if (loading) {
    return <Card loading style={{ minHeight: 340, borderRadius: 16 }} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 18,
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
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 14,
              border: `1px solid rgba(255,255,255,0.08)`,
              minHeight: 480,
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: `3px solid ${stageInfo.color}`,
              }}
            >
              <div>
                <Text strong style={{ fontSize: 14, display: 'block' }}>
                  {stageInfo.label}
                </Text>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                  ${colTotalValue.toLocaleString()} ({stageDeals.length})
                </Text>
              </div>
              <Badge count={stageDeals.length} style={{ backgroundColor: stageInfo.color }} />
            </div>

            {/* Deal Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stageDeals.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 12px',
                    color: 'rgba(148, 163, 184, 0.6)',
                    fontSize: 13,
                    border: '1px dashed rgba(148, 163, 184, 0.2)',
                    borderRadius: 12,
                  }}
                >
                  No deals in stage
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    size="small"
                    className="glass-card"
                    hoverable
                    style={{ borderRadius: 12 }}
                    bodyStyle={{ padding: 14 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text strong style={{ fontSize: 14, display: 'block', lineHeight: 1.3 }}>
                        {deal.title}
                      </Text>
                      <Tooltip title="Edit Deal">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined style={{ fontSize: 13 }} />}
                          onClick={() => onEdit(deal)}
                        />
                      </Tooltip>
                    </div>

                    <Text type="secondary" style={{ fontSize: 12, display: 'block', margin: '4px 0 10px' }}>
                      {deal.customerName || `Client #${deal.customerId}`}
                    </Text>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: '#6366f1', fontSize: 15 }}>
                        <DollarOutlined /> {deal.value.toLocaleString()}
                      </Text>

                      {deal.priority === 'high' ? (
                        <Tag color="error" style={{ margin: 0, fontSize: 10, borderRadius: 10, fontWeight: 700 }}>
                          🔥 High
                        </Tag>
                      ) : deal.priority === 'medium' ? (
                        <Tag color="warning" style={{ margin: 0, fontSize: 10, borderRadius: 10, fontWeight: 700 }}>
                          Med
                        </Tag>
                      ) : (
                        <Tag style={{ margin: 0, fontSize: 10, borderRadius: 10 }}>
                          Low
                        </Tag>
                      )}
                    </div>

                    {/* Stage Transition Control Bar */}
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: '1px solid rgba(226, 232, 240, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} /> {deal.closingDate}
                      </Text>

                      <Space size={4}>
                        {colIdx > 0 && (
                          <Tooltip title={`Move back to ${STAGES[colIdx - 1].label}`}>
                            <Button
                              type="default"
                              size="small"
                              shape="circle"
                              icon={<ArrowLeftOutlined style={{ fontSize: 11 }} />}
                              onClick={() => handleStageMove(deal, 'prev')}
                            />
                          </Tooltip>
                        )}
                        {colIdx < STAGES.length - 1 && (
                          <Tooltip title={`Advance to ${STAGES[colIdx + 1].label}`}>
                            <Button
                              type="primary"
                              size="small"
                              shape="circle"
                              icon={<ArrowRightOutlined style={{ fontSize: 11 }} />}
                              onClick={() => handleStageMove(deal, 'next')}
                            />
                          </Tooltip>
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
