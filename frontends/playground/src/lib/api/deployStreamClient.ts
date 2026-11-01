import { API_BASE } from './flociFetch';

interface StreamHandlers {
  onNode: (result: { nodeId: string; status: string; error?: string; liveUrl?: string; port?: number }) => void;
  onDone: (payload: { success: boolean; results?: any[]; logs?: any[]; error?: string }) => void;
}

function parseSseBlock(block: string, handlers: StreamHandlers) {
  const eventLine = block.split('\n').find((l) => l.startsWith('event: '));
  const dataLine = block.split('\n').find((l) => l.startsWith('data: '));
  if (!eventLine || !dataLine) return;
  const event = eventLine.slice('event: '.length);
  const data = JSON.parse(dataLine.slice('data: '.length));
  if (event === 'node') handlers.onNode(data);
  else if (event === 'done') handlers.onDone(data);
}

export async function deployInfrastructureStream(nodes: any[], edges: any[], projectId: string | undefined, handlers: StreamHandlers): Promise<void> {
  const res = await fetch(`${API_BASE}/api/orchestrator/deploy-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges, projectId }),
  });
  if (!res.body) {
    handlers.onDone({ success: false, error: 'No response stream from backend.' });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) parseSseBlock(part, handlers);
  }
  if (buffer) parseSseBlock(buffer, handlers);
}
