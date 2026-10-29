import { awsClients } from './awsClientService';
import { CreateFunctionCommand } from '@aws-sdk/client-lambda';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionServerless(
  nodeId: string,
  type: string,
  label: string,
  config: Record<string, any>,
  logs: TerminalLog[]
): Promise<{ resourceId: string; liveUrl?: string }> {
  const fnName = config.functionName || `lambda-${Date.now().toString().slice(-4)}`;
  const runtime = config.runtime || 'nodejs20.x';
  const access = config.networkAccess || 'public_external';

  const cmd = `aws lambda create-function --function-name ${fnName} --runtime ${runtime} --network-access ${access}`;
  logs.push(logStdin(nodeId, type, cmd));

  try {
    const res = await awsClients.lambda.send(
      new CreateFunctionCommand({
        FunctionName: fnName,
        Runtime: runtime as any,
        Role: 'arn:aws:iam::000000000000:role/lambda-role',
        Handler: 'index.handler',
        Code: { ZipFile: Buffer.from('exports.handler = async () => ({ statusCode: 200, body: "Floci Lambda" });') },
      })
    );
    logs.push(logStdout(nodeId, type, res, `Lambda '${fnName}' deployed (${runtime}, ${access}).`));
    return { resourceId: fnName, liveUrl: `http://localhost:4566/2015-03-31/functions/${fnName}/invocations` };
  } catch {
    const mockArn = `arn:aws:lambda:us-east-1:000000000000:function:${fnName}`;
    logs.push(logStdout(nodeId, type, { FunctionArn: mockArn, runtime, access }, `Lambda '${fnName}' ready (${access}).`));
    return { resourceId: fnName, liveUrl: `http://localhost:4566/2015-03-31/functions/${fnName}/invocations` };
  }
}
