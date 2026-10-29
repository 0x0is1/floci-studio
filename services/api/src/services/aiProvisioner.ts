import { awsClients } from './awsClientService';
import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { logStdin, logStdout, createLog, TerminalLog } from './loggerService';

export async function provisionAiResource(
  nodeId: string,
  type: string,
  label: string,
  config: Record<string, any>,
  logs: TerminalLog[]
): Promise<{ resourceId: string; liveUrl?: string }> {
  const modelId = config.modelId || 'anthropic.claude-3-sonnet-20240229-v1:0';
  const temperature = config.temperature ?? 0.7;
  const maxTokens = config.maxTokens ?? 2048;

  const cmd = `aws bedrock-runtime invoke-model --model-id ${modelId} --body '{"temperature":${temperature},"max_tokens":${maxTokens}}'`;
  logs.push(logStdin(nodeId, type, cmd));

  try {
    const isClaude = modelId.includes('claude');
    const payload = isClaude
      ? {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: maxTokens,
          temperature,
          messages: [{ role: 'user', content: 'Floci visual playground initialization probe' }],
        }
      : {
          inputText: 'Floci visual playground initialization probe',
          textGenerationConfig: { temperature, maxTokenCount: maxTokens },
        };

    const res = await awsClients.bedrockRuntime.send(
      new InvokeModelCommand({
        modelId,
        body: new TextEncoder().encode(JSON.stringify(payload)),
        contentType: 'application/json',
        accept: 'application/json',
      })
    );

    const bodyText = res.body ? new TextDecoder().decode(res.body) : '{}';
    logs.push(
      logStdout(
        nodeId,
        type,
        { modelId, status: 'AVAILABLE', temperature, maxTokens, probeResponse: bodyText },
        `Bedrock Foundation Model '${modelId}' provisioned & active.`
      )
    );
    return { resourceId: modelId, liveUrl: `http://localhost:4566/bedrock/models/${modelId}` };
  } catch (err: any) {
    logs.push(createLog(nodeId, type, 'warn', `Bedrock invocation fallback: ${err.message}`));
    return { resourceId: modelId, liveUrl: `http://localhost:4566/bedrock/models/${modelId}` };
  }
}
