# Stage 3: AWS Architecture Connection Matrix & Auto-Config

Status: COMPLETED

## Completed Objectives
1. Implemented Strict AWS Topology Compatibility Matrix (`src/lib/rules/connectionMatrix.ts`):
   - Valid rules:
     - `Client` ➔ `ALB` (Public HTTPS port 443)
     - `Client` ➔ `EC2` (Direct public HTTP port 8080)
     - `ALB` ➔ `EC2` / `Lambda` (HTTP port 80 target group routing)
     - `EC2` ➔ `S3` (IAM PutObject/GetObject + S3_BUCKET_NAME env var)
     - `EC2` ➔ `RDS` (TCP port 5432 + DATABASE_URL env var)
     - `EC2` ➔ `DynamoDB` (IAM GetItem/PutItem + DYNAMODB_TABLE env var)
     - `EC2` ➔ `SQS` (IAM SendMessage/ReceiveMessage + QUEUE_URL env var)
     - `S3` ➔ `Lambda` / `SQS` (EventBridge notifications)
     - `SQS` ➔ `EC2` / `Lambda` (Worker queue consumption)
   - Invalid connections (e.g. `Client` ➔ `RDS`, `S3` ➔ `ALB`):
     - Rejected instantly; connection wire does not attach.
     - Triggers Sonner error toast with detailed architectural violation rationale.
2. Hybrid Auto-Configuration:
   - On valid connection: auto-populates protocol, port, IAM policies, and injected environment variables.
   - Triggers success toast and selects edge to open the link inspector drawer.
3. TypeScript Verification:
   - `tsc --noEmit` verified with 0 errors.
