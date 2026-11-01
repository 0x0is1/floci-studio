import { provisionSns } from './snsProvisioner';
import { provisionSecret } from './secretsProvisioner';
import { provisionKms } from './kmsProvisioner';
import { provisionLogs } from './logsProvisioner';
import { provisionEventBridge } from './eventBridgeProvisioner';
import { provisionKinesis } from './kinesisProvisioner';
import { provisionStepFunctions } from './stepFunctionsProvisioner';
import { provisionEfs } from './efsProvisioner';
import { provisionRoute53 } from './route53Provisioner';
import { TerminalLog } from './loggerService';

type SimpleProvisioner = (nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) => Promise<{ resourceId?: string }>;

export const SIMPLE_PROVISIONERS: Record<string, SimpleProvisioner> = {
  sns: provisionSns,
  secretsmanager: provisionSecret,
  kms: provisionKms,
  logs: provisionLogs,
  events: provisionEventBridge,
  kinesis: provisionKinesis,
  states: provisionStepFunctions,
  efs: provisionEfs,
  route53: provisionRoute53,
};
