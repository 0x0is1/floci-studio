# Implementation Plans Index

This directory maintains the multi-staged execution roadmaps for the Floci AWS Visual Playground.

| Stage | Title | File | Status | Description |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Floci Docker & Bun/Elysia Backend | [stage-1-floci-backend-bun-elysia.md](stage-1-floci-backend-bun-elysia.md) | COMPLETED | Docker Compose with Floci (port 4566) + Bun/Elysia API (port 4501), project JSON persistence, and health checks. |
| 2 | Next.js Playground Canvas & Projects | [stage-2-frontend-canvas-projects.md](stage-2-frontend-canvas-projects.md) | COMPLETED | Next.js 15, shadcn/ui, Obsidian Pulse theme, official @aws-icons/react, React Flow canvas, AWS palette, and project starter boilerplate. |
| 3 | AWS Connection Matrix & Auto-Config | [stage-3-connection-matrix-rules.md](stage-3-connection-matrix-rules.md) | COMPLETED | Strict edge connection validation rules with toast error feedback and hybrid auto-configuration for valid links. |
| 4 | Orchestration & Direct Localhost EC2 URL | [stage-4-orchestration-execution.md](stage-4-orchestration-execution.md) | COMPLETED | DAG topological sort, resource provisioning via Floci AWS SDK, canvas freezing, live runtime inspector, and localhost EC2 access. |
| 5 | Root-Level Playwright E2E Suite | [stage-5-playwright-e2e-suite.md](stage-5-playwright-e2e-suite.md) | COMPLETED | End-to-end tests for project lifecycle, node drag/drop, connection validation, and deployment execution. |
