'use client';

import React from 'react';
import { AwsNodeData } from '@/types/aws';
import { useTheme } from '@/theme/ThemeProvider';
import { LiveS3Specs } from './LiveS3Specs';
import { LiveDatabaseSpecs } from './LiveDatabaseSpecs';
import { LiveQueueSpecs } from './LiveQueueSpecs';
import { LiveCloudFrontSpecs } from './LiveCloudFrontSpecs';
import { LiveEc2Specs } from './LiveEc2Specs';
import { LiveServerlessSpecs } from './LiveServerlessSpecs';
import { LiveEcsSpecs } from './LiveEcsSpecs';
import { CliCommandSnippet } from './CliCommandSnippet';

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
  if (serviceType === 'ecs') return <LiveEcsSpecs config={config} isRunning={isRunning} nodeId={nodeId} />;
  if (serviceType === 'lambda' || serviceType === 'bedrock') {
    return <LiveServerlessSpecs serviceType={serviceType} config={config} isRunning={isRunning} nodeId={nodeId} />;
  }

  const endpoint = 'http://localhost:4566';
  const region = 'us-east-1';
  const genericCmd = `aws --endpoint-url=${endpoint} --region ${region} ${serviceType} help`;

  return (
    <div className="space-y-3 text-xs select-text" style={{ userSelect: 'text' }}>
      <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Resource Target</span>
          <span className="font-mono truncate max-w-[140px] select-all" style={{ color: tokens.textPrimary }}>{config.name || serviceType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Floci Endpoint</span>
          <span className="font-mono text-xs select-all" style={{ color: tokens.accent }}>{endpoint}</span>
        </div>
      </div>
      {isRunning && (
        <CliCommandSnippet label="AWS CLI Reference" command={genericCmd} />
      )}
    </div>
  );
}
