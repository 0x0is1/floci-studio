import { describe, expect, test } from 'bun:test';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const flociConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
};

describe('Floci Bedrock AI Testing', () => {
  test('Bedrock Runtime: Invoke Titan Model', async () => {
    const client = new BedrockRuntimeClient(flociConfig);
    const res = await client.send(
      new InvokeModelCommand({
        modelId: 'amazon.titan-text-express-v1',
        body: new TextEncoder().encode(JSON.stringify({ inputText: 'Hello Bedrock' })),
        contentType: 'application/json',
        accept: 'application/json',
      })
    );
    expect(res.$metadata.httpStatusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  test('Bedrock Runtime: Invoke Claude Model', async () => {
    const client = new BedrockRuntimeClient(flociConfig);
    const res = await client.send(
      new InvokeModelCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        body: new TextEncoder().encode(
          JSON.stringify({
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: 100,
            messages: [{ role: 'user', content: 'Generate cloud architecture summary' }],
          })
        ),
        contentType: 'application/json',
        accept: 'application/json',
      })
    );
    expect(res.$metadata.httpStatusCode).toBe(200);
    expect(res.body).toBeDefined();
  });
});
