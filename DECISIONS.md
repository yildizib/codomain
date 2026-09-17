# Decisions

Decision history and rationale. Start with [Architecture](ARCHITECTURE.md) to
understand the current system; read individual ADRs when their reasoning matters.

New ADRs record status/date, context, drivers, options, decision, consequences and
revisit conditions. Preserve accepted decision bodies; record significant changes
in a new ADR and add explicit supersession links. Operational rules belong in
[Contributing](CONTRIBUTING.md) and [Coding standards](CODING_STANDARDS.md).

## Current decision precedence

| Current record | Effect on earlier records |
| --- | --- |
| [ADR-011](docs/decisions/ADR-011.md) | Replaces ADR-004's Dashboard/MCP publication boundary and refines ADR-007/010 interactions. Approval and isolation guarantees remain. |
| [ADR-012](docs/decisions/ADR-012.md) | Extends ADR-009 with application-owned messaging and Worker recovery. |
| [ADR-013](docs/decisions/ADR-013.md) | Refines ADR-005 with NFS storage and permanent-version retention. |
| [ADR-014](docs/decisions/ADR-014.md) | Selects hosted Spring AI WebMVC Streamable HTTP for V1 MCP transport. |
| [ADR-015](docs/decisions/ADR-015.md) | Selects agent-mediated, challenge-bound human confirmation without a Dashboard step. |
| [ADR-016](docs/decisions/ADR-016.md) | Selects portable ClamAV integration and application-neutral mounted artifact paths. |
| [ADR-017](docs/decisions/ADR-017.md) | Completes ADR-012 with the V1 runtime versions, Liquibase/PostgreSQL layout, standalone Artemis and Long identity contract. |

Earlier records remain historical evidence where newer decisions supersede them.
Accepted records may include explicitly labeled proposals; those proposals are
not selected technology or product behavior.

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
- [ADR-014: Use Streamable HTTP for the hosted MCP server](docs/decisions/ADR-014.md)
- [ADR-015: Use agent-mediated explicit confirmation for site actions](docs/decisions/ADR-015.md)
- [ADR-016: Use portable ClamAV scanning and mounted artifact paths](docs/decisions/ADR-016.md)
- [ADR-017: Fix the V1 runtime, messaging, migration, and identity baseline](docs/decisions/ADR-017.md)
