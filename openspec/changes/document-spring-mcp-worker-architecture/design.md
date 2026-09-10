## Context

See [proposal](proposal.md) for motivation. This change captures the agreed documentation
baseline; no runtime exists and no runtime implementation is authorized here.
Design is included because the documentation crosses application, authorization,
storage and messaging boundaries.

## Goals / Non-Goals

**Goals:** Update canonical documents, Mermaid diagrams, ADR precedence and
OpenSpec context together. Record confirmed decisions separately from proposals.

**Non-Goals:** Implement services, select unresolved runtime products, invent human
confirmation evidence, commit, deploy or archive this change.

## Decisions

- Preserve older ADR bodies and add ADR-011 for MCP-only site operations instead
  of silently rewriting the historical Dashboard approval decision.
- Add ADR-012 for three Spring Boot applications and producer-owned MQ delivery.
  The separate relay alternative is explicitly rejected; startup/periodic
  recovery stays inside each source application. Outboxes and delivery journals
  are append-only, while worker processing state can change.
- Add ADR-013 for NFS files, DB metadata, isolated processing and separate Nginx.
  Reference the unchanged sealed-digest and publication state invariants.
- Update owning documents rather than placing the new design only in a summary.
  Keep security controls in SECURITY.md, workflow in ARCHITECTURE.md, capability
  boundaries in MCP_DESIGN.md and acceptance in PRODUCT_REQUIREMENTS.md.
- Document human confirmation proof, broker, orchestration, DB layout, live
  routing, limits and archive semantics as gates for a later runtime change.
  Resolving them is not necessary to implement this documentation change and
  must not be presented as a decision-complete runtime specification.

Documentation cleanup keeps product-observable acceptance in
[Product requirements](../../../PRODUCT_REQUIREMENTS.md), implementation mechanics
in [Architecture](../../../ARCHITECTURE.md), and tool contracts in
[MCP design](../../../MCP_DESIGN.md). Summaries link to owning sections. Historical
ADRs and testable capability deltas retain their decision and acceptance context;
they are not rewritten merely to remove repeated keywords.

## Risks / Trade-offs

- Historical ADRs still mention Dashboard publishing → make supersession explicit
  in DECISIONS.md and the new ADR, and audit current documents for stale claims.
- API key authentication mistaken for human confirmation → retain the approval
  requirement and mark proof design as a runtime gate.
- Outbox delivery mistaken for exactly-once processing → describe crash windows,
  durable inbox/jobs and idempotent file effects.
- NFS pointer mistaken for DB atomicity → retain routing as an implementation
  gate and explicitly describe the consistency boundary.

## Migration Plan

Documentation-only update with no runtime or schema migration. Validate OpenSpec,
Markdown links, diagram syntax when tooling is available, and whitespace. Leave
all edits uncommitted for user review; do not archive the change. Later runtime
work requires its own plan, full tests and relevant builds.
