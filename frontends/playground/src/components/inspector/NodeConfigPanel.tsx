'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { Ec2ConfigForm } from './Ec2ConfigForm';
import { S3ConfigForm } from './S3ConfigForm';
import { RdsConfigForm } from './RdsConfigForm';
import { DynamoDbConfigForm } from './DynamoDbConfigForm';
import { SqsConfigForm } from './SqsConfigForm';
import { LambdaConfigForm } from './LambdaConfigForm';
import { AlbConfigForm } from './AlbConfigForm';
import { ApiGatewayConfigForm } from './ApiGatewayConfigForm';
import { VpcConfigForm } from './VpcConfigForm';
import { SubnetConfigForm } from './SubnetConfigForm';
import { CloudFrontConfigForm } from './CloudFrontConfigForm';
import { BedrockConfigForm } from './BedrockConfigForm';
import { GenericServiceConfigForm } from './GenericServiceConfigForm';
import { NodeIamSection } from './NodeIamSection';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

export function NodeConfigPanel() {
  const { selectedNodeId, nodes, updateNodeConfig, deleteNode } = usePlaygroundStore();
  const { tokens } = useTheme();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <div className="p-4 text-xs text-center" style={{ color: tokens.textMuted }}>
        Select a component on the canvas to configure properties.
      </div>
    );
  }

  const { data } = node;
  const config = data.config || {};

  const handleChange = (key: string, val: any) => {
    updateNodeConfig(node.id, { ...config, [key]: val }, data.label);
  };

  const handleDelete = () => {
    deleteNode(node.id);
    toast.info('Component Deleted', { description: `Removed ${data.label}` });
  };

  const renderServiceForm = () => {
    switch (data.serviceType) {
      case 'ec2': return <Ec2ConfigForm config={config} onChange={handleChange} />;
      case 's3': return <S3ConfigForm config={config} onChange={handleChange} />;
      case 'rds': return <RdsConfigForm config={config} onChange={handleChange} />;
      case 'dynamodb': return <DynamoDbConfigForm config={config} onChange={handleChange} />;
      case 'sqs': return <SqsConfigForm config={config} onChange={handleChange} />;
      case 'lambda': return <LambdaConfigForm config={config} onChange={handleChange} />;
      case 'alb': return <AlbConfigForm config={config} onChange={handleChange} />;
      case 'apigateway': return <ApiGatewayConfigForm config={config} onChange={handleChange} />;
      case 'vpc': return <VpcConfigForm config={config} onChange={handleChange} />;
      case 'subnet': return <SubnetConfigForm config={config} onChange={handleChange} />;
      case 'cloudfront': return <CloudFrontConfigForm config={config} onChange={handleChange} />;
      case 'bedrock': return <BedrockConfigForm config={config} onChange={handleChange} />;
      default: return <GenericServiceConfigForm config={config} serviceType={data.serviceType} onChange={handleChange} />;
    }
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Display Title</label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => updateNodeConfig(node.id, config, e.target.value)}
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
        />
      </div>

      {renderServiceForm()}

      <NodeIamSection node={node} config={config} onChange={handleChange} />

      <div className="pt-3 border-t" style={{ borderColor: tokens.border }}>
        <button
          type="button"
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors cursor-pointer"
        >
          <LuTrash2 className="w-3.5 h-3.5" />
          <span>Delete Component</span>
        </button>
      </div>
    </div>
  );
}