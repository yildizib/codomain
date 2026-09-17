## 1. Repository Reconciliation and Build Baseline

- [ ] 1.1 Inventory current tracked and untracked build files, modules, prototypes, caches, and IDE state; record what must be preserved before editing.
- [ ] 1.2 Remove or replace only issue-scoped prototype structure that conflicts with the approved module design, without reverting unrelated user work.
- [ ] 1.3 Add the Gradle 9.7.1 wrapper and configure Java 21 toolchains for every Java module.
- [ ] 1.4 Configure Spring Boot 4.1.1 dependency management and the Spring AI 2.0.1 BOM without direct overrides of BOM-managed Spring Framework, Liquibase, or MCP SDK versions.
- [ ] 1.5 Create independently deployable Dashboard, MCP Server, and Deployment Worker modules plus only the shared domain/application/test-support modules justified by the design.
- [ ] 1.6 Configure repositories, dependency locking, compiler warnings, JUnit Platform, formatting, static analysis, and aggregate `check`/`build` tasks.
- [ ] 1.7 Add architecture dependency tests that prevent Spring, persistence, JMS, Liquibase, and filesystem adapters from entering domain modules.
- [ ] 1.8 Document supported local tool versions and clean-checkout build commands.
- [ ] 1.9 Run formatting/static analysis, architecture tests, the full available test suite, and a clean aggregate build for the baseline.

## 2. Configuration and Local Infrastructure

- [ ] 2.1 Add typed configuration namespaces for PostgreSQL, Liquibase, Artemis, application identities, recovery timing, and environment profiles.
- [ ] 2.2 Add safe local/test defaults and fail production startup for missing credentials, journal paths, or required endpoints.
- [ ] 2.3 Redact database and broker credentials from configuration errors, logs, health details, and diagnostics.
- [ ] 2.4 Add Docker Compose PostgreSQL using disk-backed local state and health checks.
- [ ] 2.5 Add standalone ActiveMQ Artemis 2.42.0 in native mode with a dedicated persistent journal volume; do not embed it in an application.
- [ ] 2.6 Configure durable queues/messages, explicit acknowledgement, bounded redelivery/backoff, dead-letter and expiry addresses, private networking, and health checks.
- [ ] 2.7 Pin runtime images by release and record image digests where the selected registry provides them.
- [ ] 2.8 Document local startup, shutdown, safe reset, broker-journal inspection, and recovery procedures.
- [ ] 2.9 Validate Compose configuration and prove broker data survives an Artemis container restart.

## 3. Liquibase and Database Boundaries

- [ ] 3.1 Configure Liquibase changelog ownership for the shared platform foundation and each application schema.
- [ ] 3.2 Add the ordered baseline changeset that creates the `platform` schema and positive `BIGINT` `platform.global_id_seq`.
- [ ] 3.3 Add baseline application-schema changesets without creating feature-domain tables outside this change.
- [ ] 3.4 Create local/test migration-owner and application runtime roles with separate credentials.
- [ ] 3.5 Grant runtime roles required DML and `global_id_seq` access while denying DDL and other applications' domain-table access.
- [ ] 3.6 Establish the rule and validation that applied Liquibase changesets are not rewritten.
- [ ] 3.7 Add empty-database migration integration tests against the supported PostgreSQL version.
- [ ] 3.8 Add privilege tests for denied runtime DDL, denied cross-schema domain access, and allowed shared sequence allocation.
- [ ] 3.9 Add concurrent allocation and transaction-rollback tests proving global uniqueness and permitted sequence gaps.
- [ ] 3.10 Document migration execution, backup gate, environment rollback, and future prior-version upgrade testing.

## 4. Identifier and Boundary Contracts

- [ ] 4.1 Add shared application-level identifier types or conventions for required `long` IDs and nullable `Long` causation links without introducing framework dependencies.
- [ ] 4.2 Add a shared sequence allocation port and application-owned PostgreSQL adapters that obtain operation/event IDs from `platform.global_id_seq`.
- [ ] 4.3 Reject zero, negative, non-decimal, and signed-64-bit-overflow identifiers at external boundaries before resource lookup.
- [ ] 4.4 Serialize all MCP/JSON Long identifiers as base-10 strings and deserialize them through the strict shared parser.
- [ ] 4.5 Persist timestamps as PostgreSQL `timestamptz`, use Java `Instant`, and normalize external timestamps to UTC.
- [ ] 4.6 Add database/Java/JSON round-trip tests including values greater than JavaScript's maximum safe integer.
- [ ] 4.7 Add tests proving identifiers are not accepted as ownership or authorization evidence.

## 5. Outbox and Request Idempotency

- [ ] 5.1 Add application-owned insert-only outbox migrations with global `event_id`, `operation_id`, nullable `causation_event_id`, source application, schema version, type, bounded canonical payload/reference, safe actor metadata, and UTC creation time.
- [ ] 5.2 Add append-only delivery-journal migrations for attempts, broker confirmations, and safe errors without mutating source outbox rows.
- [ ] 5.3 Enforce runtime database privileges that permit outbox insert/read and journal append but deny outbox update/delete.
- [ ] 5.4 Implement a transaction-bound outbox writer that allocates event IDs and persists business intent plus immutable event in one local transaction.
- [ ] 5.5 Add account-scoped request-idempotency persistence with unique `(account_id, operation_type, idempotency_key)`, normalized request fingerprint, and resulting operation ID.
- [ ] 5.6 Implement identical-key/same-fingerprint return of the original operation and same-key/different-fingerprint conflict behavior.
- [ ] 5.7 Add transaction tests proving rollback removes both business intent and deliverable outbox event.
- [ ] 5.8 Add tests proving one operation can own multiple unique events and follow-up events retain operation and causation links.

## 6. Artemis Producer Delivery and Recovery

- [ ] 6.1 Define and validate the bounded schema-versioned MQ envelope using decimal-string operation, event, and causation identifiers.
- [ ] 6.2 Exclude uploaded bytes, raw credentials, capability secrets, and unsafe error payloads from message envelopes.
- [ ] 6.3 Implement application-owned sending of committed outbox events as persistent Artemis messages using `eventId` as delivery identity.
- [ ] 6.4 Preserve the exact event ID and canonical payload across all send retries.
- [ ] 6.5 Append delivery attempt, safe error, and broker-confirmation journal records without updating/deleting outbox rows.
- [ ] 6.6 Implement startup and periodic recovery of unconfirmed committed events with bounded backoff and safe concurrent claiming.
- [ ] 6.7 Test crash after database commit/before send and verify restart recovery sends the original event.
- [ ] 6.8 Test broker acceptance before confirmation persistence and verify retry preserves identity/payload.
- [ ] 6.9 Test broker outage and recovery without loss of accepted business intent or manual database edits.

## 7. Durable Inbox and Worker Job Acceptance

- [ ] 7.1 Add Worker-owned inbox and durable-job migrations with an inbox unique constraint on global `event_id`.
- [ ] 7.2 Add mutable job state with optimistic versioning/leases and append-only processing attempt/error history.
- [ ] 7.3 Validate producer identity, envelope schema version, size, required identities, and bounded payload before acceptance.
- [ ] 7.4 Commit first inbox receipt and durable job in one transaction before acknowledging Artemis delivery.
- [ ] 7.5 Treat duplicate event delivery as the original inbox/job acceptance without creating another job or business effect.
- [ ] 7.6 Implement explicit acknowledgement only after durable acceptance and configure redelivery for pre-ACK interruption.
- [ ] 7.7 Persist Worker result intent and a new result outbox event together, retaining operation ID and source-event causation ID.
- [ ] 7.8 Test consumer interruption before inbox commit, after inbox commit/before ACK, and during job execution.
- [ ] 7.9 Test duplicate, delayed, malformed, unauthorized, oversized, and unknown-schema events.
- [ ] 7.10 Restart Artemis with an unacknowledged persistent message and verify safe redelivery with one durable job/effect.

## 8. Documentation and Final Validation

- [ ] 8.1 Update setup/configuration documentation with the selected toolchain, BOM ownership, Liquibase, PostgreSQL schema/sequence, Artemis, and identifier contracts.
- [ ] 8.2 Document that V1 broker deployment is single-node/non-HA and that production role names and secret provider remain a production deployment gate.
- [ ] 8.3 Verify repository documentation contains no current claim that runtime versions, migration tool, broker, or global ID model remain unresolved.
- [ ] 8.4 Run Markdown link checks and `git diff --check` for all changed planning and implementation files.
- [ ] 8.5 Run OpenSpec validation for this change and the full OpenSpec set.
- [ ] 8.6 Run focused PostgreSQL, Liquibase, identifier, outbox, Artemis restart, inbox deduplication, and failure-window integration tests.
- [ ] 8.7 Run formatting, static analysis, architecture tests, the complete available test suite, and the clean aggregate Gradle build.
- [ ] 8.8 Validate all container/Compose configuration and build every application image affected by the runtime foundation.
- [ ] 8.9 Record exact commands, versions, results, and any unresolved production deployment gate before marking the change complete.
