# GEMINI.md - Agent Memory & Engineering Guidelines

This file serves as the core reference for coding, architecture, and procedural rules for the Floci AWS Visual Playground.

## Key Directives
- ZERO EMOJI POLICY: Emojis are strictly banned from the codebase. Use @aws-icons/react and react-icons.
- TSC VERIFICATION: Run `tsc --noEmit` across all workspaces after major changes to ensure zero compiler issues.
- Stack: Next.js 15 + React Flow + shadcn/ui frontend; Bun.js + Elysia API backend; Docker Compose with floci/floci:latest-compat; Playwright e2e.
- Rule of 100: Any file exceeding ~100 lines MUST be componentized into modular subcomponents (local components/ or global @/components/ui/).
- Strict Aliases: Always use @/... path aliases.
- Project Centric with Starter Boilerplate: Projects persist via services/data/projects/<id>.json and generate starter connected nodes on creation.
- Strict Connection Matrix: Reject invalid edges with shadcn destructive toasts. Apply hybrid auto-configuration for valid connections.
- Floci Integration: Floci mounts /var/run/docker.sock to enable native EC2 container execution, providing real localhost port exposure for EC2 web services.
- ZERO PULSE ANIMATION POLICY: Pulse animations (animate-pulse) are strictly banned from the codebase.
- ACTIVE ENVIRONMENT VARIABLE INJECTION: Compute nodes (EC2, Lambda, ECS) connected to downstream resources (S3, SQS, DynamoDB, RDS, SNS, Secrets, Bedrock) MUST actively receive injected environment variables with real provisioned references in both backend SDK provisioners (`Environment.Variables`) and visual inspector sidebars.
- STRICT BAN ON PUSHES AND RELEASES WITHOUT CONSENT: NEVER run `git push` or upload GitHub releases (`gh release upload`) unless the user explicitly requests or confirms it. No autonomous or unconsented pushes or release publishing under any circumstance.
- No Docs Bloat: Do not write miscellaneous documentation files; maintain only plans/INDEX.md and stage files.
