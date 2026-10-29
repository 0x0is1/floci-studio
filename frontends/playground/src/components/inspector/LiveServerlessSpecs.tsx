'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { CliCommandSnippet } from './CliCommandSnippet';

interface Props {
  serviceType: 'lambda' | 'bedrock';
  config: Record<string, any>;
  isRunning: boolean;
}

export function LiveServerlessSpecs({ serviceType, config, isRunning }: Props) {
  const { tokens } = useTheme();
  const isLambda = serviceType === 'lambda';
  const name = isLambda ? (config.functionName || 'event-processor-fn') : (config.modelId || 'anthropic.claude-3-sonnet');
  const region = 'us-east-1';

  const lambdaCli = `aws --endpoint-url=http://localhost:4566 --region ${region} lambda invoke --function-name ${name} output.json`;
  const lambdaCurl = `curl -X POST http://localhost:4566/2015-03-31/functions/${name}/invocations -d '{"event":"test"}'`;
  const bedrockCli = `aws --endpoint-url=http://localhost:4566 --region ${region} bedrock-runtime invoke-model --model-id ${name} --body '{"prompt":"Hello Floci"}' output.json`;

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>{isLambda ? 'Function Name' : 'Model Identifier'}</span>
          <span className="font-mono font-medium truncate max-w-[150px] select-all" style={{ color: tokens.textPrimary }}>{name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>{isLambda ? 'Execution Runtime' : 'Sampling Temperature'}</span>
          <span className="font-mono" style={{ color: tokens.accent }}>{isLambda ? (config.runtime || 'nodejs20.x') : (config.temperature ?? 0.7)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Floci Endpoint</span>
          <span className="font-mono text-[11px] select-all" style={{ color: tokens.textSecondary }}>http://localhost:4566</span>
        </div>
      </div>

      {isRunning && isLambda && (
        <>
          <CliCommandSnippet label="Invoke via AWS CLI" command={lambdaCli} />
          <CliCommandSnippet label="Invoke via Direct HTTP" command={lambdaCurl} />
        </>
      )}

      {isRunning && !isLambda && (
        <CliCommandSnippet label="Invoke Foundation Model CLI" command={bedrockCli} />
      )}
    </div>
  );
}
