# AGENTS.md - System Design & Engineering Standards

## 1. Project Overview
Floci AWS Visual Playground is a real local cloud infrastructure playground. Users drag and drop AWS components (EC2, S3, RDS, SQS, DynamoDB, Lambda, ALB) onto a React Flow canvas, configure connections with strict AWS architecture rules, and deploy them directly against Floci (a local multi-cloud emulator running on Docker). Live resources such as EC2 web servers are accessible directly on localhost.

## 2. Core Architecture & Principles
- Backend: Bun.js + Elysia API (services/api) running as an orchestrator alongside Floci in Docker Compose.
- Frontend: Next.js 15 with React Flow (@xyflow/react), shadcn/ui, Tailwind CSS v4, and Zustand (frontends/playground).
- Testing: Root-level Playwright test suite (tests/e2e/*.spec.ts) validating full end-to-end workflows.
- SOLID, MVC, & ACID:
  - Models / Schemas: Zod validation schemas for nodes, edges, projects, and AWS resource specifications.
  - Controllers / Routes: Clean HTTP routes handling requests with validation.
  - Services / Orchestrators: Business logic, DAG topological sorting, and AWS SDK operations isolated from HTTP layer.
  - ACID Project Storage: Safe, atomic writes for project JSON configurations.

## 3. Strict Development Rules
1. EMOJIS ARE STRICTLY BANNED:
   - Never use emojis anywhere in the codebase (no emoji icons, no emoji text, no emoji status badges).
   - Use official @aws-icons/react (AWS architecture service icons) and react-icons/fa6 / react-icons/lu.
2. TYPE-CHECK INTEGRITY (tsc --noEmit):
   - Always run `tsc --noEmit` (or test build) across both frontends and services after any major changes. Zero TypeScript errors allowed.
3. File Size & Componentization Limit (< 100 lines):
   - If any page, component, or module approaches or exceeds 100 lines, break it down immediately into local-level (components/) or global-level (@/components/ui/) components.
4. Path Aliases:
   - Strict adherence to tsconfig path aliases (@/...). No relative imports like ../../..
5. Project Scoping & Starter Boilerplate:
   - Everything exists inside a Project.
   - When creating a project, generate pre-connected, verified starter boilerplate (Client -> EC2 -> S3 and EC2 -> SQS) so users can deploy immediately.
   - Canvas states, node configurations, and execution histories persist to services/data/projects/<id>.json.
6. AWS Connection Matrix & Validation:
   - Only architecturally valid AWS connections are permitted (e.g., Client -> ALB/EC2, EC2 -> S3/RDS/SQS).
   - Incompatible connections MUST be rejected immediately and display a shadcn destructive Toast explaining the violation.
7. Documentation Rule:
   - Do NOT create unnecessary markdown docs. All architecture and stage plans live in plans/ and are tracked via plans/INDEX.md.
8. PULSE ANIMATIONS ARE STRICTLY BANNED:
   - Never use `animate-pulse` or pulse animations anywhere in the UI or codebase. All status indicators must use steady, crisp colors.
9. AUTOMATIC ENVIRONMENT VARIABLE INJECTION:
   - Compute nodes (EC2, Lambda, ECS) connected to downstream resources (S3, SQS, DynamoDB, RDS, SNS, Secrets, Bedrock) MUST have their environment variables automatically injected with real provisioned resource references in both backend SDK provisioners (`Environment.Variables` / process env) and visual inspector sidebars.

## 4. Workspaces & Directories
- frontends/playground: Next.js 15 UI
- services/: Docker Compose, Floci container, and Bun + Elysia API (services/api)
- tests/e2e/: Root-level Playwright end-to-end test suite
- plans/: Multi-staged implementation plans indexed by plans/INDEX.md
