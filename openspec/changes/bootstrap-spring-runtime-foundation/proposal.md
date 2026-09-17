## Why

Codomain's architecture is documented, but the repository has no approved,
reproducible runtime baseline for implementing the three applications. The first
implementation slice must fix compatible Java/Spring tooling, database migration,
durable messaging, and identity contracts before feature work can safely begin.

## What Changes

- Establish Java 21, Spring Boot 4.1.1, Spring Framework 7.x, Spring AI 2.0.1,
  and Gradle 9.7.1 as the V1 runtime and build baseline.
- Use Spring Boot dependency management for Spring Framework and Liquibase and
  the Spring AI BOM for the MCP Java SDK; do not override their transitive
  versions without a later approved compatibility decision.
- Use Liquibase for application-owned PostgreSQL migrations in one PostgreSQL
  cluster with separate service schemas and least-privilege roles.
- Introduce a shared PostgreSQL `global_id_seq` that issues globally unique
  `BIGINT` operation and event identifiers without granting cross-schema domain
  access.
- Run ActiveMQ Artemis 2.42.0 as a standalone, single-node broker with a
  persistent journal and durable queues/messages. V1 does not promise broker HA.
- Persist every cross-application event in an insert-only outbox in the same
  transaction as its business intent before sending it to Artemis.
- Separate account-scoped request idempotency from event delivery identity:
  `operationId` correlates one business operation, `eventId` uniquely identifies
  one outbox/MQ event, and `causationEventId` links event chains.
- Represent database identifiers as `BIGINT`, Java identifiers as `long`/`Long`,
  and MCP/JSON identifiers as decimal strings to avoid JavaScript precision loss.
- Keep product scope, account behavior, site lifecycle, uploads, content routing,
  and user-facing MCP capabilities outside this foundation change.

## Capabilities

### New Capabilities

- `runtime-foundation`: Reproducible Java/Spring builds, Liquibase-owned schemas,
  and globally unique Long identifier generation.
- `durable-messaging-runtime`: Standalone persistent Artemis delivery with
  transactional outbox, durable inbox, request idempotency, and event identity.

### Modified Capabilities

None.

## Impact

- Affects root Gradle configuration and the Dashboard, MCP Server, Deployment
  Worker, and shared foundation modules created by this change.
- Adds PostgreSQL/Liquibase schema ownership, a shared sequence, outbox/inbox and
  delivery-journal structures, and migration tests.
- Adds the Artemis client/runtime dependency, a pinned standalone broker image,
  durable queue configuration, and local deployment configuration.
- Establishes public identifier serialization used by future MCP contracts, but
  does not add site-operation tools in this change.
- Refines ADR-012 without changing its three-application or application-owned
  delivery boundaries.
