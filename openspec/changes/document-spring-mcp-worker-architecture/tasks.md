## 1. Document the agreed architecture

- [x] 1.1 Update product, MCP, security and README boundaries to account-only Dashboard and MCP-only site operations, preserving unresolved human-confirmation proof.
- [x] 1.2 Document three Spring Boot applications, producer-owned sending/recovery, insert-only outboxes, worker inbox/jobs and source/idempotency identities; update diagrams without a separate relay.
- [x] 1.3 Document uploads, isolation/scanning, NFS artifacts, version retention, separate Nginx and unresolved runtime/routing/archive choices.
- [x] 1.4 Add ADR-011/012/013, make historical precedence explicit, and align OpenSpec context and capability deltas.

- [x] 1.5 Remove redundant explanations, separate product acceptance from implementation mechanics, and use focused references without changing agreed behavior.

## 2. Validate and hand off documentation

- [x] 2.1 Run strict OpenSpec validation and check local links, headings, diagram fences and stale boundary claims.
- [x] 2.2 Run final available checks and record runtime test/build and diagram-rendering limitations; leave changes uncommitted and unarchived for review.
