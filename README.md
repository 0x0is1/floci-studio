# Floci Studio

Floci Studio is a local visual AWS architecture designer and cloud infrastructure simulator. Drag and drop AWS components (EC2, Bedrock AI, S3, SQS, DynamoDB, RDS, Lambda, CloudFront, ALB, VPC, Subnets) onto an interactive canvas, configure architectural links with validation, and deploy directly against Floci running locally on Docker.

---

## Quick Start (One-Line Run)

### 1. Start the Local Cloud & Backend Orchestrator

```bash
docker compose up -d
```

This starts:
- **Floci Multi-Cloud Emulator** on port `4566`
- **Floci Orchestrator API** on port `4501`

### 2. Start the Visual Canvas Frontend

```bash
# Using npm
npm start

# Or using Bun
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Manual Installation & Local Development

### Prerequisites
- [Docker](https://www.docker.com/) (running with Docker socket access for local EC2 container execution)
- [Bun](https://bun.sh/) (v1.1+ recommended) or [Node.js](https://nodejs.org/) (v20+)

### Environment Setup
Environment templates (`.env.example`) are provided across the repository. No real AWS credentials are ever required—safe dummy credentials (`test` / `test`) are used for the local Floci emulator.

```bash
# Backend Orchestrator
cp services/api/.env.example services/api/.env

# Frontend Studio
cp frontends/playground/.env.example frontends/playground/.env
```

### Backend Setup (Orchestrator API)

```bash
cd services/api

# Install dependencies
bun install

# Start in development watch mode (port 4501)
bun run dev

# Run wire protocol & component tests
bun test
```

### Frontend Setup (Next.js 15 Visual Playground)

```bash
cd frontends/playground

# Install dependencies
bun install   # or npm install

# Start Next.js development server (port 3000)
bun run dev   # or npm run dev

# Typecheck verification
bun run typecheck
```

---

## Testing

### End-to-End Test Suite (Playwright)

From the project root:

```bash
# Run all end-to-end tests
bun x playwright test

# Run interactive UI test explorer
bun x playwright test --ui
```

### Backend Wire Protocol Tests

```bash
bun --cwd services/api test
```

---

## Architecture & Project Structure

```
oss-floci-sim/
├── frontends/
│   └── playground/         # Next.js 15 App Router, React Flow, shadcn/ui, Zustand
├── services/
│   ├── api/                # Bun.js + Elysia API Orchestrator (DAG planner, AWS SDK)
│   ├── data/               # Persistent ACID JSON project configurations
│   └── docker-compose.yml  # Local Floci container & orchestrator definition
├── tests/
│   └── e2e/                # Playwright root end-to-end test suite
├── plans/                  # Implementation stage plans and INDEX.md
├── AGENTS.md               # System design & engineering standards
└── GEMINI.md               # Core memory & developer guidelines
```

---

## Supported AWS Services in Floci

| Service | Category | Local Floci Capability |
| :--- | :--- | :--- |
| **EC2** | Compute | Real Docker container execution on localhost with exposed web ports |
| **Bedrock AI** | Analytics & AI | Foundation model invocation (Claude 3 Sonnet, Amazon Titan) |
| **S3** | Storage | Bucket creation, object uploads, static website hosting |
| **SQS** | Messaging | Standard & FIFO queues, message dispatch |
| **DynamoDB** | Database | NoSQL table provisioning, document queries |
| **RDS** | Database | Relational database instance emulation |
| **Lambda** | Serverless | Serverless function deployment and invocation |
| **CloudFront** | Networking | Edge distribution and origin routing |
| **ALB** | Networking | Application load balancer routing |
| **VPC / Subnet**| Networking | VPC and subnet network placement topology |
