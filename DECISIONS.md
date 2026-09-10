# Decisions

This document records architecturally significant decisions for Codomain.

Use the linked records for decisions that shape system structure, ownership boundaries,
authorization, MCP contracts, deployment flow, storage, preview delivery,
published delivery, versioning, rollback, isolation, and runtime behavior.

Each record follows a lightweight Architecture Decision Record shape:

- Status
- Date
- Context
- Decision drivers
- Considered options
- Decision
- Consequences
- Revisit when

Operational policies such as Git Flow, commit style, documentation language,
and coding conventions belong in `CONTRIBUTING.md`, `CODING_STANDARDS.md`, and
`AGENTS.md`, not here.

Accepted decisions must not be silently rewritten, whether or not implementation
has started. Add a new record that identifies the earlier decision as
superseded. The edits made on 2026-09-10 clarified this initial, unimplemented
baseline before this governance rule took effect.

## Current decision precedence

[ADR-011](docs/decisions/ADR-011.md) supersedes ADR-004's Dashboard approval and
MCP publication prohibition. Its artifact-bound approval guarantees remain.
ADR-011 also refines interaction references in ADR-007/010 without weakening
content isolation. ADR-012 extends ADR-009 with durable messaging, and ADR-013
refines ADR-005 storage/retention. Earlier accepted text is retained as history;
use these newer records wherever the earlier descriptions conflict.

## Records

- [ADR-001: Use MCP as the boundary between external AI agents and Codomain](docs/decisions/ADR-001.md)
- [ADR-002: Model V1 tenancy as one account, one site, and one MCP connection](docs/decisions/ADR-002.md)
- [ADR-003: Authorize MCP operations through account-scoped API keys](docs/decisions/ADR-003.md)
- [ADR-004: Separate deployment submission from publication approval](docs/decisions/ADR-004.md)
- [ADR-005: Store site versions as immutable artifacts](docs/decisions/ADR-005.md)
- [ADR-006: Isolate user-controlled content behind ingestion and delivery boundaries](docs/decisions/ADR-006.md)
- [ADR-007: Separate dashboard, preview, and published delivery surfaces](docs/decisions/ADR-007.md)
- [ADR-008: Keep V1 runtime static-site only](docs/decisions/ADR-008.md)
- [ADR-009: Model deployment and publication as explicit state machines](docs/decisions/ADR-009.md)
- [ADR-010: Use time-limited capability URLs for isolated previews](docs/decisions/ADR-010.md)

- [ADR-011: Route all site operations through MCP](docs/decisions/ADR-011.md)
- [ADR-012: Use Spring Boot applications with application-owned MQ delivery](docs/decisions/ADR-012.md)
- [ADR-013: Store validated artifacts on NFS and serve through separate Nginx](docs/decisions/ADR-013.md)
