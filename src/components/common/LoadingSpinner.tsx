import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  tip?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  tip = 'Loading...',
  fullPage = false,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          width: '100%',
        }}
      >
        <Spin indicator={antIcon} tip={tip} size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <Spin indicator={antIcon} tip={tip} />
    </div>
  );
};
