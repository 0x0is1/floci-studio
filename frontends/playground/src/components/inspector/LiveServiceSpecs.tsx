'use client';

import React from 'react';
import { AwsNodeData } from '@/types/aws';
import { useTheme } from '@/theme/ThemeProvider';
import { LiveS3Specs } from './LiveS3Specs';
import { LiveDatabaseSpecs } from './LiveDatabaseSpecs';
import { LiveQueueSpecs } from './LiveQueueSpecs';
import { LiveCloudFrontSpecs } from './LiveCloudFrontSpecs';
import { LiveEc2Specs } from './LiveEc2Specs';

export function LiveServiceSpecs({ nodeData, nodeId }: { nodeData: AwsNodeData; nodeId?: string }) {
  const { serviceType, config = {}, status } = nodeData;
  const isRunning = status === 'running';
  const { tokens } = useTheme();

  if (serviceType === 's3') return <LiveS3Specs config={config} isRunning={isRunning} nodeId={nodeId} />;
  if (serviceType === 'sqs') return <LiveQueueSpecs config={config} isRunning={isRunning} nodeId={nodeId} />;
  if (serviceType === 'rds' || serviceType === 'dynamodb') {
    return <LiveDatabaseSpecs serviceType={serviceType} config={config} isRunning={isRunning} />;
  }
  if (serviceType === 'cloudfront') return <LiveCloudFrontSpecs nodeId={nodeId} />;
  if (serviceType === 'ec2') return <LiveEc2Specs config={config} isRunning={isRunning} nodeId={nodeId} />;

  return (
    <div className="p-3 rounded-lg border space-y-2 text-xs" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center justify-between">
        <span style={{ color: tokens.textMuted }}>Resource Target</span>
        <span className="font-mono truncate max-w-[140px]" style={{ color: tokens.textPrimary }}>{config.name || serviceType}</span>
      </div>
      <div className="flex items-center justify-between">
        <span style={{ color: tokens.textMuted }}>Floci Endpoint</span>
        <span className="font-mono text-xs" style={{ color: tokens.accent }}>http://localhost:4566</span>
      </div>
    </div>
  );
}
