## Context

See [proposal.md](proposal.md) for motivation. Codomain has three independently
deployable Spring Boot applications and an accepted application-owned outbox and
Worker inbox architecture, but it does not yet have runtime modules or an
implementation-ready persistence and broker baseline. Existing local prototypes
are not authoritative and must be reconciled without deleting unrelated work.

## Goals / Non-Goals

**Goals:**

- Produce one reproducible Java 21 multi-project build for all applications.
- Pin compatible platform releases while leaving transitive versions under their
  owning BOMs.
- Establish application-owned Liquibase migrations and least-privilege schema
  boundaries in one PostgreSQL cluster.
- Provide globally unique Long operation/event identities without UUIDs.
- Establish durable at-least-once Artemis delivery with outbox/inbox
  deduplication and recoverable producer sending.
- Provide local integration infrastructure and tests for the selected baseline.

**Non-Goals:**

- Implement registration, API keys, MCP tools, uploads, scanning, previews,
  approval, publishing, rollback, or retention behavior.
- Promise MQ high availability or introduce broker clustering.
- Introduce a separate outbox relay service.
- Provision production secrets or finalize production database role names.
- Treat numeric identifiers as authorization, chronology, or gapless counters.

## Decisions

### Runtime and dependency ownership

Use Java 21, Spring Boot 4.1.1, Spring Framework 7.x, Spring AI 2.0.1, and the
Gradle 9.7.1 wrapper. Spring Boot dependency management owns Spring Framework,
Liquibase, database, JMS, and common runtime library versions. The Spring AI
2.0.1 BOM owns the MCP Java SDK. Build files do not pin transitive versions
already managed by those BOMs unless a future ADR documents a compatibility
exception.

This uses the requested Spring 4.x generation while keeping the MCP transport on
the supported Spring AI 2.0 line. Gradle is pinned so CI and local dependency
resolution use the same build engine.

### Module boundaries

Create independently deployable `dashboard`, `mcp-server`, and
`deployment-worker` modules. Shared modules may contain narrow domain/application
contracts and test support, but framework, JMS, JPA/JDBC, Liquibase, and
filesystem adapters remain in owning application/infrastructure modules.
Architecture tests enforce inward dependencies.

### PostgreSQL ownership and Liquibase

Use one PostgreSQL cluster with a small shared foundation schema and separate
application schemas. Liquibase owns ordered changesets per application. A
migration owner applies DDL; normal runtime roles receive only the DML and shared
sequence privileges they require. No application runtime role receives access to
another application's domain tables.

The first migration creates `platform.global_id_seq` before application schemas
reference it. Later changesets are append-only in normal development: an applied
changeset is not rewritten. Migration tests cover an empty database and, once a
second schema version exists, upgrades from the prior supported state.

Production role names and the production secret source remain a deployment
policy gate. Local/test roles use non-production credentials supplied through
environment configuration.

### Long identity contract

Every operation and event obtains a value from `platform.global_id_seq`. Sequence
allocation is concurrency-safe and globally unique across services, but gaps are
expected because PostgreSQL sequences are not transactional. IDs are opaque and
positive.

Persist IDs as `BIGINT`; use Java `long` for required IDs and `Long` for nullable
links such as `causationEventId`. Serialize IDs in MCP/JSON as decimal strings and
parse them with strict positive signed-64-bit range validation. This avoids
precision loss in JavaScript clients.

Persist instants as PostgreSQL `timestamptz` and expose them internally as Java
`Instant`, normalized to UTC at boundaries. Use database constraints for
state-independent invariants, optimistic version columns for mutable aggregates,
and bounded row claiming for outbox and durable-job workers.

Use three related identities:

- `operationId`: one accepted business operation and its correlation root.
- `eventId`: one immutable outbox/MQ event and the consumer inbox deduplication
  key.
- `causationEventId`: optional link to the event that produced a follow-up event.

Client request idempotency remains an account-scoped key, stored with operation
type, normalized request fingerprint, and resulting operation ID. It cannot be
replaced by a server-generated operation ID because the first response may be
lost before the client learns that ID.

### Outbox and producer recovery

Each producing application inserts immutable business event data into its own
outbox in the same local transaction as business intent. Outbox rows include
event ID, operation ID, optional causation event ID, source application, schema
version, event type, bounded payload/reference, actor metadata, and creation time.

Normal roles may insert/read outbox rows but may not update/delete them. Delivery
attempts, broker confirmations, and safe errors are appended to a separate
journal. Each application sends and recovers its own unconfirmed events at
startup and periodically; no relay service is introduced. Every retry preserves
the event ID and canonical payload.

### Artemis deployment and delivery

Run Apache ActiveMQ Artemis 2.42.0 as a standalone single container/process in
native mode, not embedded in an application. Configure a persistent journal on a
dedicated disk-backed volume, durable queues, persistent messages, explicit
consumer acknowledgement, bounded redelivery with backoff, and dead-letter and
expiry addresses. Pin the broker image by version (and digest in deployment
configuration when available).

The broker is transport, not the source of accepted business truth. A broker
outage leaves committed outbox events pending. V1 operates one broker node and
does not claim HA; backup/restore and later clustering remain operations work.

### Inbox and Worker acceptance

Consumers validate the message envelope and producer identity, then insert the
event ID into an inbox with a unique constraint. The Worker commits inbox receipt
and durable job before acknowledging the message. A duplicate event reads the
existing inbox/job outcome and does not create a second effect. Worker result
events use the same outbox rules and new globally unique event IDs.

## Risks / Trade-offs

- **Single Artemis node can interrupt delivery** -> Outbox retains accepted intent;
  health checks and recovery resend after broker restoration. No V1 HA claim is
  made.
- **Shared sequence is a cross-schema dependency** -> Grant only `USAGE/SELECT`
  on the sequence and keep all domain-table privileges isolated.
- **Sequence exhaustion or hotspot** -> `BIGINT` capacity is sufficient for V1;
  monitor allocation rate and use PostgreSQL sequence caching without assigning
  business ordering semantics.
- **String IDs are less idiomatic for Java consumers** -> Centralize boundary
  serialization/parsing and keep internal types numeric.
- **BOM upgrades can change transitive behavior** -> Pin platform patch releases,
  use dependency locking, and require full compatibility tests for upgrades.
- **Journal disk loss can lose broker copies** -> Outbox remains the recovery
  source for unconfirmed delivery; production backup/HA policy is deferred to the
  operations change.

## Migration Plan

1. Inventory and preserve existing tracked/untracked prototype work.
2. Establish the Gradle wrapper, modules, BOMs, toolchain, quality plugins, and
   dependency locking.
3. Add PostgreSQL and Liquibase infrastructure, shared sequence migration,
   application schemas, and local least-privilege roles.
4. Add outbox, delivery-journal, inbox, and durable-job foundation migrations and
   adapters.
5. Add standalone Artemis configuration and local container infrastructure.
6. Add producer recovery, consumer deduplication, and failure-window integration
   tests.
7. Run migration, build, architecture, PostgreSQL, and broker-restart validation
   before feature changes depend on the foundation.

Rollback removes newly deployed applications and broker configuration only after
stopping producers/consumers. Applied database migrations are not destructively
rolled back in place; restore the pre-change database backup for an environment
rollback. No production data migration is expected because runtime implementation
has not started.

## Open Questions

- Select production database role names and the production secret provider before
  production deployment. This does not change schema boundaries or local/test
  implementation.
