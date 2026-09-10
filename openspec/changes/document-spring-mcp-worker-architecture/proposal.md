## Why

The documented dashboard publication boundary no longer matches the agreed MCP-only site workflow. Capture the selected Spring Boot applications and durable messaging architecture before runtime implementation.

## What Changes

- **BREAKING**: Move all site operations, including approval, publication and rollback, to MCP; restrict Dashboard to account and credential management.
- Select separate Spring Boot MVC Dashboard, MCP Server and persistent Worker applications.
- Define application-owned MQ delivery, insert-only outboxes, source identity and durable worker inbox processing without a separate relay.
- Document large uploads, isolated scanning, immutable NFS artifacts, separate Nginx delivery and retention.
- Add superseding ADRs and update canonical documents and diagrams. Preserve unresolved implementation choices explicitly.
- Separate product acceptance from implementation details; replace repeated explanations with links to owning sections.

## Capabilities

### New Capabilities

- `mcp-site-lifecycle`: MCP-only site operations and account-only Dashboard.
- `durable-app-messaging`: Application-owned delivery, append-only outboxes and worker recovery.
- `artifact-processing`: Upload, quarantine, sealing, NFS delivery and retained versions.

### Modified Capabilities

None; no existing main OpenSpec capability files are present.

## Impact

Documentation and OpenSpec only; no application code, dependencies, deployment configuration, commits or publication. V1 remains one account, one static site and one MCP connection. AI hosting, dynamic user code execution and team workflows remain out of scope. Exact human approval proof, broker, runtime orchestration, physical DB layout and live routing remain open before implementation.
