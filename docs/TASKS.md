# Codomain V1 Detailed Task Checklist

## 1. How to Use This Checklist

This is the executable checklist for the roadmap in [PLAN.md](PLAN.md). The
authoritative product, architecture, MCP, security, decision, coding, and
contribution documents still control their respective subjects.

Rules for execution:

- Complete tasks in dependency order unless a task explicitly says it may run in
  parallel.
- Create or update an approved OpenSpec change before implementing a phase.
- Attach each implementation change to one GitHub issue, issue branch, and pull
  request according to [CONTRIBUTING.md](../CONTRIBUTING.md).
- Keep repository artifacts and user-facing copy in English.
- Do not check a task box merely because code exists. Check it only after its
  implementation, focused tests, full-suite checks, relevant builds, and
  documentation are complete.
- Record exact validation commands and results in the implementing change.
- Leave unresolved-policy boxes unchecked; they are implementation gates.
- Preserve unrelated and untracked user work.

Task states:

- `[ ]` not started or not proven.
- `[x]` completed with recorded evidence.
- `[!]` blocked; use this only in issue/OpenSpec notes, not by editing the checkbox
  syntax in this file.

## 2. Selected V1 Decisions

- [x] D-001 Require email verification in V1.
- [x] D-002 Require password reset in V1.
- [x] D-003 Support both user-requested and generated free subdomains.
- [x] D-004 Check generated and requested subdomain availability before display
  and again with an authoritative race-safe allocation transaction.
- [x] D-005 Use Spring AI MCP Server WebMVC with Streamable HTTP.
- [x] D-006 Do not support legacy HTTP/SSE or STDIO as hosted V1 transports.
- [x] D-007 Keep preview, approval, publication, and rollback inside MCP; do not
  require Dashboard confirmation.
- [x] D-008 Require agent-mediated explicit confirmation backed by a short-lived,
  single-use, action-bound server challenge.
- [x] D-009 Use real ClamAV behind a portable scanner interface.
- [x] D-010 Include separate-VPS Nginx deployment in the initial operational path.
- [x] D-011 Treat artifact storage as configured POSIX paths; operators may mount
  NFS later without application-level NFS integration.
- [x] D-022 Use Java 21, Spring Boot 4.1.1, Spring Framework 7.x, Spring AI
  2.0.1, and Gradle 9.7.1. Let the Spring Boot and Spring AI BOMs own their
  managed dependency versions.
- [x] D-023 Use Liquibase with one PostgreSQL cluster, a shared foundation schema,
  application-owned schemas, and a shared `platform.global_id_seq`.
- [x] D-024 Use standalone single-node ActiveMQ Artemis 2.42.0 with a disk-backed
  persistent journal and durable queues/messages; V1 does not promise broker HA.
- [x] D-026 Use global positive `BIGINT` IDs from the shared sequence, Java
  `long`/`Long`, and decimal-string MCP/JSON serialization. Use UTC `Instant` /
  PostgreSQL `timestamptz`, database constraints for invariants, optimistic
  version columns for mutable aggregates, and database row claiming for durable
  work.

## 3. Remaining Blocking Decisions

### Account and product policy

- [ ] D-012 Select the final product domain and live/preview host patterns.
- [ ] D-013 Define subdomain syntax, length, case normalization, Unicode/IDN
  policy, reserved words, and abuse-prone names.
- [ ] D-014 Define generated-name format, entropy, retry count, and fallback when
  candidates are unavailable.
- [ ] D-015 Define whether an unverified account may sign in and which operations
  remain blocked until verification.
- [ ] D-016 Define email-verification token lifetime, resend interval, resend cap,
  invalidation, and account-expiry policy.
- [ ] D-017 Define password-reset token lifetime, resend/rate limits, and session
  revocation behavior after reset.
- [ ] D-018 Define password policy and compromised-password-check policy.
- [ ] D-019 Define session idle lifetime, absolute lifetime, concurrent-session
  policy, and recent-authentication window.
- [ ] D-020 Select transactional email provider and define local email capture.
- [ ] D-021 Finalize Terms version and any additional consent.

### Runtime and data

- [ ] D-025 Define service/database roles and environment secret source.

### MCP and credentials

- [ ] D-027 Verify the V1 client list against Streamable HTTP; record exact client
  versions and configuration formats.
- [ ] D-028 Select MCP endpoint path, API-key header scheme, protocol version
  compatibility policy, and request timeout.
- [ ] D-029 Define API-key format, verifier algorithm, rotation/revocation
  propagation target, and last-used update policy.
- [ ] D-030 Define idempotency-key syntax and retention period.
- [ ] D-031 Define confirmation challenge lifetime and whether preview, approval,
  publication, and rollback each require a distinct challenge.
- [ ] D-032 Define the exact user-facing confirmation text/fingerprint and MCP
  request/response schemas.

### Upload, scanning, retention, and publication

- [ ] D-033 Set request, inline-file, file-count, per-file, aggregate, chunk,
  concurrency, and archive-expansion limits.
- [ ] D-034 Decide whether archives are accepted in V1.
- [ ] D-035 Define allowed/blocked file types, MIME policy, entry-point rules, and
  response headers.
- [ ] D-036 Select resumable upload protocol and integrity algorithm.
- [ ] D-037 Define upload-session and quarantine expiry.
- [ ] D-038 Confirm the exact per-site last-10 temporary-content policy.
- [ ] D-039 Define ClamAV image/version policy, signature update schedule,
  signature freshness threshold, scan timeout, and resource limits.
- [ ] D-040 Select live-routing strategy and publication applied-state semantics.
- [ ] D-041 Define preview capability lifetime, renewal, revocation, and referrer
  policy.
- [ ] D-042 Define publication preconditions, retry limits, propagation target,
  and cache policy.
- [ ] D-043 Define archive behavior or explicitly exclude it from V1 tools.
- [ ] D-044 Define audit, journal, upload, preview, and operational retention.
- [ ] D-045 Define backup scope, schedule, RPO, RTO, and restore frequency.

## 4. Phase 0 - Planning and Repository Reconciliation

### P0-T01 Inventory current repository state

Dependencies: none.

- [ ] P0-T01-01 Capture `git status`, active branch, tracked files, and untracked
  files without deleting or resetting anything.
- [ ] P0-T01-02 Inventory root Gradle files and all module directories.
- [ ] P0-T01-03 Map each existing source file to Dashboard, MCP Server, Worker,
  shared domain/application, prototype, or generated/local state.
- [ ] P0-T01-04 Identify compilation errors, placeholder implementations, unsafe
  temporary paths, missing dependencies, and architecture violations.
- [ ] P0-T01-05 Record which prototype behavior is reusable only after tests.
- [ ] P0-T01-06 Record which files overlap unrelated user work and must be edited
  carefully.
- [ ] P0-T01-07 Verify ignore rules cover `.gradle`, IDE state, build output,
  local environment files, secrets, uploads, quarantine, and mounted artifacts.
- [ ] P0-T01-08 Create an issue-linked reconciliation report in the foundation
  OpenSpec change.

Exit evidence:

- [ ] P0-T01-E1 Repository inventory is reviewed.
- [ ] P0-T01-E2 No existing prototype is represented as production-ready.
- [ ] P0-T01-E3 No unrelated file was removed or reverted.

### P0-T02 Create implementation OpenSpec changes

Dependencies: P0-T01.

- [ ] P0-T02-01 Create `implement-runtime-foundation`.
- [ ] P0-T02-02 Create `implement-dashboard-account-access`.
- [ ] P0-T02-03 Create `implement-mcp-auth-and-onboarding`.
- [ ] P0-T02-04 Create `implement-messaging-and-worker-foundation`.
- [ ] P0-T02-05 Create `implement-deployment-submission`.
- [ ] P0-T02-06 Create `implement-worker-artifact-processing`.
- [ ] P0-T02-07 Create `implement-preview-and-approval`.
- [ ] P0-T02-08 Create `implement-publication-and-rollback`.
- [ ] P0-T02-09 Create `implement-production-operations`.
- [ ] P0-T02-10 Give each change proposal, design, delta specs, tasks, explicit
  non-goals, security scenarios, migration strategy, and validation plan.
- [ ] P0-T02-11 Validate each OpenSpec change before implementation.
- [ ] P0-T02-12 Link every change to its owning issue and dependency chain.

### P0-T03 Close decisions for the foundation slice

Dependencies: P0-T01, P0-T02.

- [ ] P0-T03-01 Complete the remaining D-025 production role/secret decision.
- [x] P0-T03-02 Record selected runtime, migration, broker and identity decisions
  in ADR-017.
- [ ] P0-T03-03 Update authoritative documents only where their owned behavior
  changes.
- [ ] P0-T03-04 Revalidate Markdown links and OpenSpec artifacts.
- [ ] P0-T03-05 Obtain human approval for the foundation proposal/design/tasks.

## 5. Phase 1 - Runtime Foundation

### P1-T01 Establish the Gradle build

Dependencies: P0-T03.

- [ ] P1-T01-01 Add and pin Gradle wrapper 9.7.1.
- [ ] P1-T01-02 Configure Java 21, Spring Boot 4.1.1 and Spring AI 2.0.1 BOMs;
  do not override BOM-managed Spring Framework, Liquibase or MCP SDK versions.
- [ ] P1-T01-03 Include only intentional modules in `settings.gradle`.
- [ ] P1-T01-04 Configure Java toolchains for the selected JDK.
- [ ] P1-T01-05 Configure JUnit Platform and deterministic test settings.
- [ ] P1-T01-06 Configure formatting and static-analysis plugins.
- [ ] P1-T01-07 Configure compiler warnings and decide which warnings fail CI.
- [ ] P1-T01-08 Add aggregate `check`, `test`, and `build` behavior.
- [ ] P1-T01-09 Prevent Spring, persistence, transport, and filesystem adapters
  from becoming dependencies of domain modules.
- [ ] P1-T01-10 Add architecture dependency tests.
- [ ] P1-T01-11 Add dependency locking or the approved reproducibility mechanism.
- [ ] P1-T01-12 Document local tool prerequisites and build commands.

Exit evidence:

- [ ] P1-T01-E1 `./gradlew clean check` passes.
- [ ] P1-T01-E2 `./gradlew clean build` passes.
- [ ] P1-T01-E3 A clean checkout resolves only pinned/approved dependencies.

### P1-T02 Define application configuration

Dependencies: P1-T01.

- [ ] P1-T02-01 Define configuration namespaces for Dashboard, MCP Server, and
  Worker.
- [ ] P1-T02-02 Add typed validation for database, broker, mail, ClamAV, artifact
  paths, public origins, cookie settings, and operational limits.
- [ ] P1-T02-03 Separate local, test, staging, and production profiles.
- [ ] P1-T02-04 Ensure production has no weak fallback secrets or default admin
  credentials.
- [ ] P1-T02-05 Fail startup on missing required production values.
- [ ] P1-T02-06 Redact secrets from configuration binding errors and diagnostics.
- [ ] P1-T02-07 Add example environment files with placeholders only.
- [ ] P1-T02-08 Add configuration binding and invalid-startup tests.

### P1-T03 Establish database and migrations

Dependencies: P1-T01 and D-025 for production role/secret finalization.

- [ ] P1-T03-01 Provision local PostgreSQL with the selected version.
- [ ] P1-T03-02 Create migration-owner and runtime roles.
- [ ] P1-T03-03 Revoke runtime DDL privileges.
- [ ] P1-T03-04 Create a shared `platform` schema and separate application-owned
  schemas without cross-schema domain-table access.
- [ ] P1-T03-05 Configure Liquibase changelog locations per owning application.
- [ ] P1-T03-06 Add ordered baseline changesets and prohibit rewriting applied
  changesets.
- [ ] P1-T03-07 Create `platform.global_id_seq`; grant only required sequence
  access to application roles.
- [ ] P1-T03-08 Add central strict Long-to-decimal-string JSON serialization and
  positive signed-64-bit parsing tests.
- [ ] P1-T03-09 Add empty-database migration test.
- [ ] P1-T03-10 Add prior-version upgrade migration test when the second migration
  is introduced.
- [ ] P1-T03-11 Verify normal roles cannot alter immutable outbox/audit structures
  contrary to policy.
- [ ] P1-T03-12 Verify sequence allocation is globally unique across applications,
  accepts gaps after rollback, and grants no domain-table access.
- [ ] P1-T03-13 Document migration execution, rollback policy, and backup gate.

### P1-T04 Create local runtime topology

Dependencies: P1-T02 and P1-T03.

- [ ] P1-T04-01 Add Docker Compose PostgreSQL service with health check.
- [ ] P1-T04-02 Add standalone ActiveMQ Artemis 2.42.0 with health check,
  persistent journal volume, durable queues/messages, explicit ACK, redelivery,
  dead-letter and expiry configuration; do not use embedded mode.
- [ ] P1-T04-03 Add ClamAV service with private networking and signature storage.
- [ ] P1-T04-04 Create separate local quarantine and sealed-artifact volumes.
- [ ] P1-T04-05 Mount quarantine only into MCP Server/Worker roles that require it.
- [ ] P1-T04-06 Mount sealed content read-write only into the Worker.
- [ ] P1-T04-07 Mount sealed content read-only into content Nginx.
- [ ] P1-T04-08 Prove content Nginx cannot resolve or read quarantine paths.
- [ ] P1-T04-09 Add service health/readiness dependencies without assuming startup
  ordering guarantees correctness.
- [ ] P1-T04-10 Document startup, stop, log inspection, safe reset, and common
  failure recovery.

### P1-T05 Create separate-VPS Nginx deployment path

Dependencies: P1-T04, D-012.

- [ ] P1-T05-01 Define preview and live content virtual hosts.
- [ ] P1-T05-02 Keep Dashboard and content origins on separate registrable-domain
  or origin boundaries selected by security design.
- [ ] P1-T05-03 Configure TLS termination assumptions and trusted proxy headers.
- [ ] P1-T05-04 Define a sealed-content mount point as an operator prerequisite.
- [ ] P1-T05-05 Do not add application-level NFS libraries or provisioning.
- [ ] P1-T05-06 Configure the sealed mount read-only for Nginx.
- [ ] P1-T05-07 Disable directory listing, unsafe method handling, and path escape.
- [ ] P1-T05-08 Add safe MIME, content-disposition, caching, referrer, and baseline
  security header configuration placeholders pending D-035/D-041.
- [ ] P1-T05-09 Add syntax/configuration tests for Nginx.
- [ ] P1-T05-10 Document VPS install/deploy/reload/rollback and mount validation.

### P1-T06 Establish CI

Dependencies: P1-T01 through P1-T05.

- [ ] P1-T06-01 Run formatting verification.
- [ ] P1-T06-02 Run static analysis and architecture tests.
- [ ] P1-T06-03 Run unit and integration tests.
- [ ] P1-T06-04 Run PostgreSQL migration tests.
- [ ] P1-T06-05 Validate Docker Compose and Nginx configuration.
- [ ] P1-T06-06 Build all application artifacts and container images.
- [ ] P1-T06-07 Scan dependencies, committed secrets, and images.
- [ ] P1-T06-08 Retain useful reports without retaining secrets or uploaded bytes.
- [ ] P1-T06-09 Make every required gate visible and mandatory for review.

## 6. Phase 2 - Dashboard Account and Authentication

### P2-T01 Implement account/site domain model

Dependencies: P1, D-012 through D-021.

- [ ] P2-T01-01 Define Account ID, normalized email, display names, password hash,
  verification state, status, and timestamps.
- [ ] P2-T01-02 Define TermsAcceptance with immutable version and timestamp.
- [ ] P2-T01-03 Define Site separately from Account.
- [ ] P2-T01-04 Enforce one site per V1 account at database level.
- [ ] P2-T01-05 Define SubdomainAllocation status and normalized name.
- [ ] P2-T01-06 Enforce active subdomain uniqueness at database level.
- [ ] P2-T01-07 Define Session identity, issued/seen/expiry/revocation timestamps,
  and safe client metadata policy.
- [ ] P2-T01-08 Add repositories/use cases without exposing persistence models to
  domain logic.
- [ ] P2-T01-09 Test all cardinality, transition, and concurrency invariants.

### P2-T02 Implement subdomain selection and generation

Dependencies: P2-T01, D-012 through D-014.

- [ ] P2-T02-01 Implement canonical normalization and allowlist validation.
- [ ] P2-T02-02 Reject reserved, administrative, misleading, and abuse-prone names.
- [ ] P2-T02-03 Implement non-authoritative availability lookup for typed names.
- [ ] P2-T02-04 Implement generated candidate creation using approved word/entropy
  rules.
- [ ] P2-T02-05 Check every generated candidate before presenting it.
- [ ] P2-T02-06 Avoid leaking private account/site information in availability
  responses.
- [ ] P2-T02-07 Recheck availability in the allocation transaction.
- [ ] P2-T02-08 Handle uniqueness races by generating/suggesting a replacement.
- [ ] P2-T02-09 Limit generation and availability requests against enumeration and
  resource abuse.
- [ ] P2-T02-10 Test normalization collisions, reserved names, concurrent claims,
  exhausted generation retries, and foreign-account probing.

### P2-T03 Implement registration

Dependencies: P2-T01, P2-T02.

- [ ] P2-T03-01 Build accessible registration form and server-rendered validation.
- [ ] P2-T03-02 Require email, first name, last name, password/confirmation, Terms,
  and selected/generated subdomain choice.
- [ ] P2-T03-03 Normalize email while preserving intended display values.
- [ ] P2-T03-04 Hash password with approved adaptive algorithm/parameters.
- [ ] P2-T03-05 Create account, Terms acceptance, site, subdomain, and verification
  request in a consistent transaction/recovery flow.
- [ ] P2-T03-06 Return enumeration-safe responses for duplicate email.
- [ ] P2-T03-07 Apply IP/account/request rate limits and abuse telemetry.
- [ ] P2-T03-08 Ensure failure leaves no activated partial account/site.
- [ ] P2-T03-09 Audit registration outcome without password/token data.
- [ ] P2-T03-10 Test valid, invalid, duplicate, concurrent, interrupted, and
  rate-limited registration.

### P2-T04 Implement email verification

Dependencies: P2-T03, D-015, D-016, D-020.

- [ ] P2-T04-01 Generate a cryptographically random verification token.
- [ ] P2-T04-02 Store only a non-recoverable token verifier and safe metadata.
- [ ] P2-T04-03 Send a single-purpose HTTPS verification link via mail adapter.
- [ ] P2-T04-04 Exclude token/link from logs, analytics, referers, and audit data.
- [ ] P2-T04-05 Enforce expiry, one-time use, account binding, and state checks.
- [ ] P2-T04-06 Implement enumeration-safe resend with cooldown and cap.
- [ ] P2-T04-07 Invalidate prior tokens according to D-016.
- [ ] P2-T04-08 Activate permitted account capabilities after successful verify.
- [ ] P2-T04-09 Test replay, expiry, malformed token, resend races, email provider
  failure, and already-verified behavior.

### P2-T05 Implement sign-in and sessions

Dependencies: P2-T03, P2-T04, D-015, D-019.

- [ ] P2-T05-01 Implement enumeration-resistant credential errors.
- [ ] P2-T05-02 Apply password verification safely and update hash parameters on
  successful sign-in when policy requires.
- [ ] P2-T05-03 Enforce unverified-account policy.
- [ ] P2-T05-04 Regenerate session identity at authentication.
- [ ] P2-T05-05 Issue Secure, HttpOnly, SameSite, host-only `__Host-` cookie.
- [ ] P2-T05-06 Apply CSRF protection to state-changing browser requests.
- [ ] P2-T05-07 Enforce idle and absolute session expiry.
- [ ] P2-T05-08 Implement logout and server-side revocation.
- [ ] P2-T05-09 Enforce suspension and concurrent-session policy.
- [ ] P2-T05-10 Apply sign-in throttling and security monitoring.
- [ ] P2-T05-11 Test fixation, forged cookie, CSRF, expiry, logout, suspension,
  brute-force limits, and account enumeration.

### P2-T06 Implement password change

Dependencies: P2-T05, D-018, D-019.

- [ ] P2-T06-01 Require authenticated session, recent authentication, and current
  password.
- [ ] P2-T06-02 Validate new password and confirmation.
- [ ] P2-T06-03 Reject prohibited/compromised passwords according to policy.
- [ ] P2-T06-04 Persist new adaptive hash transactionally.
- [ ] P2-T06-05 Revoke or re-authenticate sessions according to policy.
- [ ] P2-T06-06 Invalidate outstanding reset tokens.
- [ ] P2-T06-07 Notify the account without including sensitive details.
- [ ] P2-T06-08 Audit and test success, wrong current password, CSRF, stale recent
  auth, concurrency, and session invalidation.

### P2-T07 Implement password reset

Dependencies: P2-T03, D-017, D-018, D-020.

- [ ] P2-T07-01 Build request and completion forms.
- [ ] P2-T07-02 Return the same request response for known and unknown email.
- [ ] P2-T07-03 Generate a random reset token and store only its verifier.
- [ ] P2-T07-04 Enforce expiry, one-time use, purpose, account binding, and resend
  invalidation policy.
- [ ] P2-T07-05 Rate-limit by safe dimensions without creating enumeration clues.
- [ ] P2-T07-06 Deliver reset link through mail adapter without token logging.
- [ ] P2-T07-07 Validate new password and update hash atomically with token use.
- [ ] P2-T07-08 Revoke all required sessions and outstanding reset tokens.
- [ ] P2-T07-09 Notify the account of completed reset.
- [ ] P2-T07-10 Test unknown email, replay, expiry, malformed token, concurrent use,
  resend, provider failure, rate limit, and session revocation.

### P2-T08 Build protected Dashboard experience

Dependencies: P2-T05 through P2-T07.

- [ ] P2-T08-01 Add authenticated layout/navigation.
- [ ] P2-T08-02 Show safe account and verification status.
- [ ] P2-T08-03 Show site and allocated subdomain.
- [ ] P2-T08-04 Add password, API-key, and MCP-onboarding destinations only.
- [ ] P2-T08-05 Do not expose deployment, preview, version, publish, or rollback
  controls/routes.
- [ ] P2-T08-06 Add loading, validation, empty, success, expired, and safe error
  states.
- [ ] P2-T08-07 Add responsive keyboard-accessible forms and focus management.
- [ ] P2-T08-08 Configure CSP, frame protection, content type, referrer, cache, and
  HSTS policy as appropriate per environment.
- [ ] P2-T08-09 Run accessibility and browser security tests.

Phase exit:

- [ ] P2-E1 Dashboard focused tests pass.
- [ ] P2-E2 Full test suite passes.
- [ ] P2-E3 Dashboard build passes.
- [ ] P2-E4 Registration, verification, login, password change, password reset,
  and logout pass an end-to-end browser test.

## 7. Phase 3 - API Keys and MCP Onboarding

### P3-T01 Model API-key lifecycle

Dependencies: P2, D-029.

- [ ] P3-T01-01 Define key ID, non-secret prefix, verifier, status, creation,
  rotation/revocation, and safe last-used metadata.
- [ ] P3-T01-02 Enforce at most one active key per account in the database.
- [ ] P3-T01-03 Define create, rotate, revoke, and rejected transition rules.
- [ ] P3-T01-04 Define authorization-cache invalidation event/strategy.
- [ ] P3-T01-05 Test concurrent create and rotate invariants.

### P3-T02 Implement key creation

- [ ] P3-T02-01 Require authenticated, verified, non-suspended account.
- [ ] P3-T02-02 Require recent browser authentication and CSRF token.
- [ ] P3-T02-03 Generate secret with a cryptographically secure source.
- [ ] P3-T02-04 Store only verifier and display-safe metadata.
- [ ] P3-T02-05 Display raw secret exactly once with no server-side redisplay path.
- [ ] P3-T02-06 Send no raw key to logs, analytics, audit, URLs, or email.
- [ ] P3-T02-07 Handle response interruption by requiring safe rotation, not secret
  recovery.
- [ ] P3-T02-08 Test leakage surfaces and duplicate creation.

### P3-T03 Implement rotation and revocation

- [ ] P3-T03-01 Require recent authentication and CSRF.
- [ ] P3-T03-02 Rotate transactionally while preserving audit linkage.
- [ ] P3-T03-03 Revoke idempotently.
- [ ] P3-T03-04 Invalidate caches and queued-sensitive-operation authorization
  according to D-029.
- [ ] P3-T03-05 Prove old credentials fail within propagation target.
- [ ] P3-T03-06 Test concurrent rotation/revocation and multi-replica behavior.

### P3-T04 Produce MCP connection instructions

Dependencies: D-027, D-028, ADR-014.

- [ ] P3-T04-01 Define one source model for endpoint and client configurations.
- [ ] P3-T04-02 Add Streamable HTTP endpoint instructions.
- [ ] P3-T04-03 Add API-key header/secret-store instructions.
- [ ] P3-T04-04 Add only compatibility-tested client examples.
- [ ] P3-T04-05 Generate downloadable `CODOMAIN_MCP_README.md`.
- [ ] P3-T04-06 Use placeholders, never the issued key, in generated documents.
- [ ] P3-T04-07 Reflect active/revoked/no-key state accurately.
- [ ] P3-T04-08 Add snapshot/contract tests and secret-leak tests.

Phase exit:

- [ ] P3-E1 Key lifecycle security tests pass.
- [ ] P3-E2 Supported client configuration smoke tests pass.
- [ ] P3-E3 Full suite and Dashboard build pass.

## 8. Phase 4 - Messaging and Worker Foundation

### P4-T01 Define message contracts

Dependencies: P1.

- [ ] P4-T01-01 Define envelope schema version and content type.
- [ ] P4-T01-02 Define global `eventId` as both immutable outbox row ID and MQ
  delivery identity; serialize it as a decimal string externally.
- [ ] P4-T01-03 Include global `operationId`, optional `causationEventId`, source
  application, actor, type, UTC creation time, and bounded payload reference.
- [ ] P4-T01-04 Define maximum size and schema validation.
- [ ] P4-T01-05 Exclude bytes, API keys, capability tokens, password/reset tokens,
  and unsafe errors.
- [ ] P4-T01-06 Define compatibility and unknown-version rejection.
- [ ] P4-T01-07 Define broker identities and least-privilege routing permissions.

### P4-T02 Implement source outbox

- [ ] P4-T02-01 Create insert-only outbox table and append-only delivery journal.
- [ ] P4-T02-02 Enforce normal-role INSERT/SELECT without UPDATE/DELETE on outbox.
- [ ] P4-T02-03 Commit domain intent and outbox insert together.
- [ ] P4-T02-04 Allocate `eventId` from `platform.global_id_seq` and preserve that
  ID and canonical payload across every delivery retry.
- [ ] P4-T02-05 Record each delivery attempt and broker confirmation.
- [ ] P4-T02-06 Recover unconfirmed rows at startup and on schedule.
- [ ] P4-T02-07 Apply bounded exponential backoff and jitter.
- [ ] P4-T02-08 Avoid concurrent duplicate sends beyond tolerated at-least-once
  behavior.

### P4-T03 Implement Worker inbox and durable jobs

- [ ] P4-T03-01 Validate producer identity and envelope schema.
- [ ] P4-T03-02 Deduplicate through a durable inbox unique constraint on
  `eventId`.
- [ ] P4-T03-03 Commit inbox and durable job before ACK.
- [ ] P4-T03-04 Define queued, claimed, running, retry-wait, succeeded, failed, and
  cancelled/enforcement states as approved.
- [ ] P4-T03-05 Claim jobs safely across replicas.
- [ ] P4-T03-06 Heartbeat/lease claims and recover abandoned work.
- [ ] P4-T03-07 Append attempts and errors without overwriting history.
- [ ] P4-T03-08 Classify retryable, terminal, stale, and poison failures.

### P4-T04 Implement Worker results

- [ ] P4-T04-01 Commit domain result and Worker outbox together.
- [ ] P4-T04-02 Publish progress, retry, failure, and success result types.
- [ ] P4-T04-03 Consume results idempotently in owning application.
- [ ] P4-T04-04 Reject stale/illegal lifecycle transitions.
- [ ] P4-T04-05 Preserve actor/source/correlation relationships.

### P4-T05 Prove failure recovery

- [ ] P4-T05-01 Test crash before source transaction commit.
- [ ] P4-T05-02 Test commit before send.
- [ ] P4-T05-03 Test send before confirmation journal.
- [ ] P4-T05-04 Test Worker receipt before inbox commit.
- [ ] P4-T05-05 Test inbox commit before broker ACK.
- [ ] P4-T05-06 Test crash during job execution.
- [ ] P4-T05-07 Test duplicate, delayed, out-of-order, malformed, unauthorized,
  oversized, and poison messages.
- [ ] P4-T05-08 Test broker outage and restart recovery.
- [ ] P4-T05-09 Verify DB privileges for outbox/journal immutability.
- [ ] P4-T05-10 Test one `operationId` producing multiple unique event IDs with
  correct `causationEventId` links.
- [ ] P4-T05-11 Test duplicate Artemis delivery creates one inbox/job/business
  effect.

## 9. Phase 5 - MCP Foundation

### P5-T01 Integrate Spring AI Streamable HTTP server

Dependencies: P3, ADR-014, D-027, D-028.

- [ ] P5-T01-01 Add compatible Spring AI BOM/starter selected in D-022.
- [ ] P5-T01-02 Use `spring-ai-starter-mcp-server-webmvc`.
- [ ] P5-T01-03 Configure `spring.ai.mcp.server.protocol=STREAMABLE`.
- [ ] P5-T01-04 Configure server name/version, capabilities, endpoint, request
  timeout, and graceful shutdown.
- [ ] P5-T01-05 Disable unneeded prompts/resources/sampling capabilities.
- [ ] P5-T01-06 Ensure unauthenticated tool listing/invocation is impossible.
- [ ] P5-T01-07 Add protocol initialization and version-negotiation tests.
- [ ] P5-T01-08 Add compatibility tests for each advertised client/version.

### P5-T02 Implement API-key authentication

- [ ] P5-T02-01 Extract only the approved header scheme.
- [ ] P5-T02-02 Reject credentials in query/path parameters.
- [ ] P5-T02-03 Redact credential header from access/application logs.
- [ ] P5-T02-04 Parse key prefix and locate active candidate safely.
- [ ] P5-T02-05 Verify non-recoverable representation using constant-time behavior
  where applicable.
- [ ] P5-T02-06 Resolve account status and single site server-side.
- [ ] P5-T02-07 Reject missing, malformed, unknown, revoked, rotated, unverified,
  or suspended credentials safely.
- [ ] P5-T02-08 Apply rate limits and safe last-used metadata policy.

### P5-T03 Implement authorization boundary

- [ ] P5-T03-01 Define authenticated request principal without raw key material.
- [ ] P5-T03-02 Scope every repository query by principal account/site.
- [ ] P5-T03-03 Treat client resource/account/site IDs only as lookup inputs, not
  authority.
- [ ] P5-T03-04 Recheck ownership and lifecycle immediately before effects.
- [ ] P5-T03-05 Make foreign and nonexistent private resources indistinguishable.
- [ ] P5-T03-06 Define queued-operation authorization freshness.
- [ ] P5-T03-07 Add cross-account matrix tests for every tool.

### P5-T04 Implement idempotency

- [ ] P5-T04-01 Normalize and fingerprint relevant request input.
- [ ] P5-T04-02 Persist account, operation type, key, fingerprint, operation ID,
  and retention expiry.
- [ ] P5-T04-03 Serialize concurrent first use.
- [ ] P5-T04-04 Return original operation for identical reuse.
- [ ] P5-T04-05 Return safe conflict for changed input under the same key.
- [ ] P5-T04-06 Test retry after response loss and multi-replica concurrency.

### P5-T05 Define and implement base MCP schemas

- [ ] P5-T05-01 Define common IDs, timestamps, pagination, operation state,
  attempt, warning, and error schemas.
- [ ] P5-T05-02 Define `get_site_context` capability.
- [ ] P5-T05-03 Define deployment/version/publication history capability.
- [ ] P5-T05-04 Define operation-status capability.
- [ ] P5-T05-05 Define structured error codes without private-resource disclosure.
- [ ] P5-T05-06 Version schemas and add golden contract fixtures.
- [ ] P5-T05-07 Implement stable cursor ordering and bounds.
- [ ] P5-T05-08 Test malformed arguments and oversized responses.

Phase exit:

- [ ] P5-E1 Unauthenticated MCP discovery and invocation are rejected.
- [ ] P5-E2 Valid client initializes and invokes base tools.
- [ ] P5-E3 Cross-account, idempotency, error, schema, and leakage tests pass.
- [ ] P5-E4 Full suite and MCP Server build pass.

## 10. Phase 6 - Upload and Deployment Acceptance

### P6-T01 Model upload/deployment records

Dependencies: P4, P5, D-033 through D-038.

- [ ] P6-T01-01 Define UploadSession owner, status, limits, expiry, integrity, and
  finalized deployment relationship.
- [ ] P6-T01-02 Define uploaded part/file metadata without client-controlled storage
  paths.
- [ ] P6-T01-03 Define Deployment accepted time, source app/actor, input reference,
  processing status, and failure summary.
- [ ] P6-T01-04 Define separate attempts/history.
- [ ] P6-T01-05 Ensure basic rejection versus accepted-then-validation-failure is
  represented distinctly.

### P6-T02 Implement path and file policy

- [ ] P6-T02-01 Decode names once under explicit encoding rules.
- [ ] P6-T02-02 Normalize separators and relative paths canonically.
- [ ] P6-T02-03 Reject absolute paths, dot traversal, empty/ambiguous segments,
  control characters, unsafe Unicode, and platform aliases.
- [ ] P6-T02-04 Reject links, devices, sockets, pipes, and special files.
- [ ] P6-T02-05 Reject duplicate normalized/case-folded paths as policy requires.
- [ ] P6-T02-06 Enforce allowed types using content inspection plus extension
  policy.
- [ ] P6-T02-07 Enforce entry-point and safe delivery metadata rules.
- [ ] P6-T02-08 Add hostile path/file corpus tests.

### P6-T03 Implement inline submission

- [ ] P6-T03-01 Define versioned MCP request/response schema.
- [ ] P6-T03-02 Require idempotency key.
- [ ] P6-T03-03 Stream/decode under request, file-count, per-file, and aggregate
  limits.
- [ ] P6-T03-04 Generate server-owned quarantine namespace.
- [ ] P6-T03-05 Write files using safe create semantics inside that namespace.
- [ ] P6-T03-06 Recompute sizes/digests while writing.
- [ ] P6-T03-07 Freeze input against further MCP writes.
- [ ] P6-T03-08 Create accepted deployment before validation processing begins.
- [ ] P6-T03-09 Commit deployment/operation/outbox consistently.
- [ ] P6-T03-10 Reconcile partial filesystem/DB outcomes.

### P6-T04 Implement resumable upload sessions

- [ ] P6-T04-01 Add MCP tool to create account/site-bound session.
- [ ] P6-T04-02 Return controlled transfer URL without API key in URL.
- [ ] P6-T04-03 Authenticate every transfer request.
- [ ] P6-T04-04 Enforce session expiry/status and server limits.
- [ ] P6-T04-05 Validate part number/range/length/checksum.
- [ ] P6-T04-06 Make identical part retries idempotent.
- [ ] P6-T04-07 Reject conflicting duplicate parts.
- [ ] P6-T04-08 Limit per-account/session concurrency and storage consumption.
- [ ] P6-T04-09 Expose safe upload progress through MCP.
- [ ] P6-T04-10 Hide storage paths and foreign session existence.

### P6-T05 Finalize upload

- [ ] P6-T05-01 Lock session against concurrent parts/finalization.
- [ ] P6-T05-02 Verify complete part/file set and aggregate integrity.
- [ ] P6-T05-03 Reapply path/type/limit policy.
- [ ] P6-T05-04 Assemble/freeze final quarantine input safely.
- [ ] P6-T05-05 Create deployment, operation, and outbox request.
- [ ] P6-T05-06 Return original deployment on identical finalize retry.
- [ ] P6-T05-07 Reject incomplete, expired, foreign, or conflicting finalization.
- [ ] P6-T05-08 Reconcile DB/filesystem interruption.

### P6-T06 Implement upload expiry and cleanup

- [ ] P6-T06-01 Select eligible sessions under D-037/D-038.
- [ ] P6-T06-02 Exclude active transfers/finalization/jobs.
- [ ] P6-T06-03 Delete only server-owned resolved namespaces.
- [ ] P6-T06-04 Record cleanup attempts/results.
- [ ] P6-T06-05 Preserve deployment/session history.
- [ ] P6-T06-06 Retry safely after mount/DB outage.

Phase exit:

- [ ] P6-E1 Inline and resumable happy paths pass.
- [ ] P6-E2 Hostile path/type/limit/archive tests pass.
- [ ] P6-E3 Interruption, duplicate, expiry, isolation, and cleanup tests pass.
- [ ] P6-E4 MQ payload inspection confirms no uploaded bytes or secrets.
- [ ] P6-E5 Full suite and MCP Server build pass.

## 11. Phase 7 - Validation, ClamAV, and Sealing

### P7-T01 Define canonical manifest

- [ ] P7-T01-01 Define canonical relative path encoding and ordering.
- [ ] P7-T01-02 Define included file metadata and excluded mutable metadata.
- [ ] P7-T01-03 Select digest algorithm and serialization format.
- [ ] P7-T01-04 Compute per-file and aggregate digest.
- [ ] P7-T01-05 Include validation-policy identity separately where needed.
- [ ] P7-T01-06 Create cross-module golden vectors.
- [ ] P7-T01-07 Test byte/path/type changes alter identity and identical input is
  deterministic.

### P7-T02 Revalidate frozen input

- [ ] P7-T02-01 Open only the deployment's server-owned quarantine root.
- [ ] P7-T02-02 Walk without following links.
- [ ] P7-T02-03 Recheck every path and file type.
- [ ] P7-T02-04 Recompute file count, sizes, media types, and digests.
- [ ] P7-T02-05 Enforce archive expansion recursively if archives are allowed.
- [ ] P7-T02-06 Enforce entry point and delivery policy.
- [ ] P7-T02-07 Store structured result and policy version.
- [ ] P7-T02-08 End invalid deployments without creating artifact/preview/version.

### P7-T03 Implement portable ClamAV adapter

Dependencies: D-039, ADR-016.

- [ ] P7-T03-01 Define scanner port with scan request/result and health metadata.
- [ ] P7-T03-02 Implement ClamAV private service adapter.
- [ ] P7-T03-03 Provide only current job files/streams and no platform credentials.
- [ ] P7-T03-04 Disable unnecessary scanner network access.
- [ ] P7-T03-05 Enforce connect/read/overall timeout and input limits.
- [ ] P7-T03-06 Scan every file intended for delivery.
- [ ] P7-T03-07 Capture engine version, signature identity/time, scan time, result,
  and artifact digest.
- [ ] P7-T03-08 Treat infected, error, timeout, stale signatures, incomplete scan,
  and unreadable content as not clean.
- [ ] P7-T03-09 Classify retryable scanner infrastructure failure separately from
  terminal content rejection.
- [ ] P7-T03-10 Keep fake scanner only for unit tests; use real ClamAV in
  integration/end-to-end tests.

### P7-T04 Seal artifact

- [ ] P7-T04-01 Allocate server-owned staging directory under sealed root.
- [ ] P7-T04-02 Copy/promote only validated and scanned files.
- [ ] P7-T04-03 Verify every output against manifest during/after write.
- [ ] P7-T04-04 Fsync/close according to durability design.
- [ ] P7-T04-05 Atomically expose completed directory where filesystem permits.
- [ ] P7-T04-06 Apply immutable/read-only permissions for normal runtime roles.
- [ ] P7-T04-07 Persist artifact metadata only when durable preparation is known.
- [ ] P7-T04-08 Reconcile orphan staging directories and incomplete records.
- [ ] P7-T04-09 Verify content Nginx can read completed sealed content only.

### P7-T05 Report processing result

- [ ] P7-T05-01 Publish bounded progress events.
- [ ] P7-T05-02 Publish safe validation rejection details.
- [ ] P7-T05-03 Publish malware rejection without exposing payload.
- [ ] P7-T05-04 Publish retryable infrastructure status/attempt.
- [ ] P7-T05-05 Publish sealed artifact success with stable identity.
- [ ] P7-T05-06 Reject stale result application in MCP Server state.

Phase exit:

- [ ] P7-E1 Canonical manifest and tamper tests pass.
- [ ] P7-E2 Real ClamAV clean and EICAR-style detection integration tests pass in
  an isolated test environment.
- [ ] P7-E3 Scanner timeout/stale/outage tests block preview.
- [ ] P7-E4 Partial seal/mount outage/crash/duplicate recovery tests pass.
- [ ] P7-E5 Full suite and Worker build pass.

## 12. Phase 8 - Preview and Agent Confirmation

### P8-T01 Model previews and confirmation challenges

Dependencies: P7, D-031, D-032, D-041.

- [ ] P8-T01-01 Define Preview target as one sealed artifact or immutable version.
- [ ] P8-T01-02 Define capability verifier, creation, expiry, revocation, renewal,
  and unavailable state.
- [ ] P8-T01-03 Define ConfirmationChallenge account, actor/key, action, target,
  digest/version, preview, expiry, used/revoked state, and nonce verifier.
- [ ] P8-T01-04 Store non-recoverable secret representations.
- [ ] P8-T01-05 Define action-specific challenge transitions.
- [ ] P8-T01-06 Define account/key suspension/revocation invalidation behavior.

### P8-T02 Implement preview creation/renewal tools

- [ ] P8-T02-01 Define create-preview MCP schema.
- [ ] P8-T02-02 Allow only sealed deployment artifact or retained version target.
- [ ] P8-T02-03 Recheck account/site ownership and lifecycle.
- [ ] P8-T02-04 Generate high-entropy capability.
- [ ] P8-T02-05 Return isolated-origin URL, expiry, and safe target identity.
- [ ] P8-T02-06 Exclude capability from logs/audit/analytics.
- [ ] P8-T02-07 Define renew/regenerate as new capability with prior capability
  revocation/supersession per policy.
- [ ] P8-T02-08 Support previous-version previews.
- [ ] P8-T02-09 Make tool idempotent where appropriate.

### P8-T03 Implement preview routing on Nginx path

- [ ] P8-T03-01 Resolve capability without exposing storage path.
- [ ] P8-T03-02 Verify active, unexpired, non-revoked, available target.
- [ ] P8-T03-03 Route only to exact sealed directory.
- [ ] P8-T03-04 Prevent traversal, alias confusion, directory listing, and direct
  internal-path access.
- [ ] P8-T03-05 Apply approved MIME/content-disposition/referrer/cache headers.
- [ ] P8-T03-06 Send no Dashboard cookies or control-plane credentials.
- [ ] P8-T03-07 Return non-disclosing responses for invalid/foreign capabilities.
- [ ] P8-T03-08 Test separate-VPS configuration with read-only mounted content.

### P8-T04 Implement agent-mediated confirmation

Dependencies: ADR-015, D-031, D-032.

- [ ] P8-T04-01 Add challenge-creation tool/action for approval.
- [ ] P8-T04-02 Return preview URL, safe artifact fingerprint, requested action,
  expiry, and exact confirmation instruction.
- [ ] P8-T04-03 Require supported client/agent to present this context and pause
  for explicit user response.
- [ ] P8-T04-04 Accept challenge completion only with challenge secret/proof and
  action-specific request.
- [ ] P8-T04-05 Atomically consume challenge once.
- [ ] P8-T04-06 Reject `confirmed=true` without valid challenge.
- [ ] P8-T04-07 Reject expiry, replay, target/digest/action mismatch, key
  revocation/rotation, account suspension, and stale deployment state.
- [ ] P8-T04-08 Audit issue/use/outcome without challenge secret.
- [ ] P8-T04-09 Add supported-client interaction tests proving the agent pauses
  for human input.

### P8-T05 Implement approval

- [ ] P8-T05-01 Authenticate API key and resolve site.
- [ ] P8-T05-02 Validate/consume approval challenge.
- [ ] P8-T05-03 Recheck sealed artifact, digest, preview target, ownership, and
  account state.
- [ ] P8-T05-04 Persist exact-digest approval with actor/source identity.
- [ ] P8-T05-05 Create version-creation operation and outbox atomically.
- [ ] P8-T05-06 Return original approval/operation for identical retry.
- [ ] P8-T05-07 Require new approval for any different artifact/deployment.

Phase exit:

- [ ] P8-E1 Capability expiry/revocation/renewal/isolation tests pass.
- [ ] P8-E2 Browser origin/cookie/referrer tests pass.
- [ ] P8-E3 Challenge replay/race/mismatch/revocation tests pass.
- [ ] P8-E4 Supported agent confirmation journey passes without Dashboard.
- [ ] P8-E5 Full suite and relevant builds pass.

## 13. Phase 9 - Versions, Publication, and Rollback

### P9-T01 Model immutable versions and publication records

Dependencies: P8, D-040, D-042.

- [ ] P9-T01-01 Define Version site, sequence/display ID, artifact, approval,
  creator, and creation time.
- [ ] P9-T01-02 Prevent update/delete through application/domain and DB roles.
- [ ] P9-T01-03 Define Publication request separately from attempts.
- [ ] P9-T01-04 Define publish versus rollback reason/type.
- [ ] P9-T01-05 Define target version, expected live version, actor, operation,
  state, and terminal result.
- [ ] P9-T01-06 Define PublicationAttempt immutable attempt/error/applied evidence.
- [ ] P9-T01-07 Define Site live pointer and optimistic concurrency.

### P9-T02 Create version from approval

- [ ] P9-T02-01 Recheck approval/digest/artifact/site/account state.
- [ ] P9-T02-02 Mark artifact permanently retained before version success.
- [ ] P9-T02-03 Create exactly one version per approved operation.
- [ ] P9-T02-04 Handle DB/mount interruption through reconciliation.
- [ ] P9-T02-05 Publish Worker result idempotently.
- [ ] P9-T02-06 Test duplicate jobs and concurrent approvals.

### P9-T03 Implement publication confirmation and request

- [ ] P9-T03-01 Issue publication-specific human challenge with target version and
  current live version context.
- [ ] P9-T03-02 Require agent to show action and wait for explicit user response.
- [ ] P9-T03-03 Consume valid challenge once.
- [ ] P9-T03-04 Recheck key/account/site/version/enforcement state.
- [ ] P9-T03-05 Persist publication request and outbox atomically.
- [ ] P9-T03-06 Return accepted operation, not premature live success.
- [ ] P9-T03-07 Make retries idempotent and changed-input reuse conflicting.

### P9-T04 Apply publication

- [ ] P9-T04-01 Claim publication job and recheck stale/precondition state.
- [ ] P9-T04-02 Recheck authorization freshness and enforcement restrictions.
- [ ] P9-T04-03 Verify target artifact exists and matches manifest.
- [ ] P9-T04-04 Prepare routing update without mutating version files.
- [ ] P9-T04-05 Apply D-040 routing strategy with stale-operation guard.
- [ ] P9-T04-06 Verify externally observable selected content/readiness.
- [ ] P9-T04-07 Record immutable attempt evidence.
- [ ] P9-T04-08 Commit success/live pointer according to applied-state semantics.
- [ ] P9-T04-09 On failure, retain prior live pointer/routing and record safe error.
- [ ] P9-T04-10 Reconcile uncertain applied state after crash/timeouts.

### P9-T05 Implement rollback

- [ ] P9-T05-01 List eligible retained previous versions.
- [ ] P9-T05-02 Issue rollback-specific confirmation challenge.
- [ ] P9-T05-03 Require explicit agent-mediated user response.
- [ ] P9-T05-04 Create rollback publication targeting existing version.
- [ ] P9-T05-05 Reuse publication application/recovery path.
- [ ] P9-T05-06 Do not create or modify a Version.
- [ ] P9-T05-07 Verify exact selected version is live after success.

### P9-T06 Expose live state and history through MCP

- [ ] P9-T06-01 Return live version only under D-040 success semantics.
- [ ] P9-T06-02 Return versions with safe artifact/approval provenance.
- [ ] P9-T06-03 Return publication requests and attempts distinctly.
- [ ] P9-T06-04 Identify rollback operations and targets.
- [ ] P9-T06-05 Explain in-progress/uncertain state safely.
- [ ] P9-T06-06 Paginate with stable ordering and tenant scope.

Phase exit:

- [ ] P9-E1 Publish first and second versions successfully.
- [ ] P9-E2 Roll back to first version without creating another version.
- [ ] P9-E3 Duplicate/stale/out-of-order/crash/outage/cache-delay tests pass.
- [ ] P9-E4 Every simulated failure proves previous live content remains served.
- [ ] P9-E5 Revoked/suspended/takedown actors cannot publish or roll back.
- [ ] P9-E6 Full suite and all relevant builds pass.

## 14. Phase 10 - Retention, Audit, Operations, and Deployment

### P10-T01 Implement retention cleanup

- [ ] P10-T01-01 Encode D-037/D-038/D-043/D-044 policies explicitly.
- [ ] P10-T01-02 Select temporary deployment candidates per site.
- [ ] P10-T01-03 Exclude active upload/job/preview/approval/version references.
- [ ] P10-T01-04 Protect every version-referenced artifact permanently.
- [ ] P10-T01-05 Mark expired preview content unavailable without deleting history.
- [ ] P10-T01-06 Delete only verified eligible server-owned directories.
- [ ] P10-T01-07 Record cleanup operation/attempt/outcome.
- [ ] P10-T01-08 Add dry-run/report mode for operators.
- [ ] P10-T01-09 Test concurrent cleanup versus approval/version creation.

### P10-T02 Implement audit

- [ ] P10-T02-01 Define append-oriented audit schema and DB permissions.
- [ ] P10-T02-02 Record auth/session/password/key events.
- [ ] P10-T02-03 Record upload/deployment/scan/preview/approval events.
- [ ] P10-T02-04 Record version/publication/rollback events and failures.
- [ ] P10-T02-05 Record suspension/takedown/operator actions.
- [ ] P10-T02-06 Include actor, source, target, correlation, time, decision, and
  outcome.
- [ ] P10-T02-07 Exclude all secrets, full uploaded payloads, and unsafe errors.
- [ ] P10-T02-08 Enforce retention/access policy and test immutability.

### P10-T03 Implement observability

- [ ] P10-T03-01 Propagate safe correlation across HTTP/MCP, operation, message,
  job, and attempt.
- [ ] P10-T03-02 Add structured redacted logs.
- [ ] P10-T03-03 Add request/error/duration metrics per service.
- [ ] P10-T03-04 Add queue lag, job age/retry, scanner health/signature age,
  upload/storage, cleanup, publication, and Nginx metrics.
- [ ] P10-T03-05 Add traces where they provide operational value without payloads.
- [ ] P10-T03-06 Test redaction using representative secret values.
- [ ] P10-T03-07 Create alerts with thresholds, ownership, and runbook links.

### P10-T04 Implement operational controls

- [ ] P10-T04-01 Separate liveness and readiness endpoints.
- [ ] P10-T04-02 Restrict management endpoints to private/operator access.
- [ ] P10-T04-03 Add authorized job retry/reconciliation operations.
- [ ] P10-T04-04 Add site/account suspension and content takedown.
- [ ] P10-T04-05 Prevent publish/rollback from bypassing enforcement.
- [ ] P10-T04-06 Add strongly authorized restoration with audit.
- [ ] P10-T04-07 Write broker, DB, mount, ClamAV, Worker, mail, and Nginx runbooks.

### P10-T05 Implement backup and restore

Dependencies: D-045.

- [ ] P10-T05-01 Back up PostgreSQL metadata with documented consistency point.
- [ ] P10-T05-02 Back up permanent sealed/version artifacts.
- [ ] P10-T05-03 Encrypt backups and restrict credentials/access.
- [ ] P10-T05-04 Define whether temporary/quarantine data is excluded.
- [ ] P10-T05-05 Automate isolated restore environment.
- [ ] P10-T05-06 Verify schema, references, sampled manifests, and live pointers.
- [ ] P10-T05-07 Revoke/rotate capabilities and reconcile routing after restore.
- [ ] P10-T05-08 Record measured RPO/RTO from restore exercise.

### P10-T06 Package and deploy applications

- [ ] P10-T06-01 Build minimal pinned non-root images for all three applications.
- [ ] P10-T06-02 Add read-only root filesystem and writable paths only where
  required.
- [ ] P10-T06-03 Apply service-specific users, mounts, networks, and resource
  limits.
- [ ] P10-T06-04 Keep DB, broker, ClamAV, and management interfaces private.
- [ ] P10-T06-05 Deploy content Nginx on separate VPS.
- [ ] P10-T06-06 Validate operator-provided sealed-content mount before reload.
- [ ] P10-T06-07 Never mount quarantine on the Nginx VPS.
- [ ] P10-T06-08 Configure TLS, DNS, restart, rolling/restart, and rollback process.
- [ ] P10-T06-09 Scan images and retain software/dependency inventory.
- [ ] P10-T06-10 Exercise staging deployment and rollback.

## 15. Phase 11 - End-to-End and Launch Gates

### P11-T01 Complete full user journey test

- [ ] P11-T01-01 Register with generated subdomain suggestion.
- [ ] P11-T01-02 Register another account with user-requested subdomain.
- [ ] P11-T01-03 Prove unavailable generated/requested names are replaced/rejected
  safely under race.
- [ ] P11-T01-04 Verify both email addresses.
- [ ] P11-T01-05 Sign in, change password, sign out, and complete password reset.
- [ ] P11-T01-06 Create API key and configure each supported client.
- [ ] P11-T01-07 Submit inline static site.
- [ ] P11-T01-08 Submit large site through resumable upload with interruption.
- [ ] P11-T01-09 Observe accepted, processing, retry/progress, and success states.
- [ ] P11-T01-10 Open isolated preview.
- [ ] P11-T01-11 Complete agent-mediated explicit approval.
- [ ] P11-T01-12 Create and publish first immutable version.
- [ ] P11-T01-13 Publish second version.
- [ ] P11-T01-14 Preview prior version and roll back to first.
- [ ] P11-T01-15 Rotate/revoke key and prove old key rejection.

### P11-T02 Complete security test campaign

- [ ] P11-T02-01 Test account/email/subdomain enumeration resistance.
- [ ] P11-T02-02 Test session fixation, CSRF, cookie scope, and origin isolation.
- [ ] P11-T02-03 Test raw credential/token/capability leakage surfaces.
- [ ] P11-T02-04 Test every MCP tool for cross-account ID substitution.
- [ ] P11-T02-05 Test path traversal, links, special files, MIME confusion,
  oversized input, and archive bomb if archives are supported.
- [ ] P11-T02-06 Test capability guessing, expiry, replay, renewal, and referrer
  leakage.
- [ ] P11-T02-07 Test confirmation challenge replay/mismatch and autonomous boolean
  bypass.
- [ ] P11-T02-08 Test stale publication/rollback and direct quarantine access.
- [ ] P11-T02-09 Test rate limits and safe/non-disclosing errors.
- [ ] P11-T02-10 Resolve all launch-blocking findings and rerun affected suites.

### P11-T03 Complete resilience campaign

- [ ] P11-T03-01 Interrupt each outbox/inbox/job failure window.
- [ ] P11-T03-02 Restart each application independently during active work.
- [ ] P11-T03-03 Interrupt broker, DB, ClamAV, artifact mount, and Nginx.
- [ ] P11-T03-04 Prove recovery of accepted work without duplicate effects.
- [ ] P11-T03-05 Prove previous live content remains available through publication
  and rollback failures.
- [ ] P11-T03-06 Measure recovery and propagation against targets.

### P11-T04 Complete capacity campaign

- [ ] P11-T04-01 Document expected V1 account, upload, deployment, and traffic load.
- [ ] P11-T04-02 Test auth/MCP rate limits and connection concurrency.
- [ ] P11-T04-03 Test concurrent inline/resumable uploads.
- [ ] P11-T04-04 Test Worker/ClamAV throughput and queue growth.
- [ ] P11-T04-05 Test mounted-storage capacity/latency/error behavior.
- [ ] P11-T04-06 Test preview/live Nginx throughput and cache policy.
- [ ] P11-T04-07 Record bottlenecks, scaling triggers, and alert thresholds.

### P11-T05 Complete documentation and operations handoff

- [ ] P11-T05-01 Update README implementation status and getting started.
- [ ] P11-T05-02 Document local setup and verified commands.
- [ ] P11-T05-03 Document every environment variable without secret examples.
- [ ] P11-T05-04 Document migrations and deployment rollback.
- [ ] P11-T05-05 Document separate-VPS Nginx and mount prerequisites.
- [ ] P11-T05-06 Document ClamAV signatures, health, and outage behavior.
- [ ] P11-T05-07 Document backup/restore and disaster recovery.
- [ ] P11-T05-08 Document incident response, suspension/takedown, and private
  vulnerability reporting.
- [ ] P11-T05-09 Finalize `CODOMAIN_MCP_README.md` generation and client guides.
- [ ] P11-T05-10 Verify links and remove stale/prototype claims.

### P11-T06 Execute final release gate

- [ ] P11-T06-01 Confirm all required OpenSpec tasks are complete.
- [ ] P11-T06-02 Validate all OpenSpec changes.
- [ ] P11-T06-03 Run formatting and static analysis.
- [ ] P11-T06-04 Run migration tests from empty and supported prior state.
- [ ] P11-T06-05 Run every focused test suite.
- [ ] P11-T06-06 Run the full repository test suite.
- [ ] P11-T06-07 Build all application artifacts.
- [ ] P11-T06-08 Build and scan all container images.
- [ ] P11-T06-09 Validate Docker Compose and production Nginx configuration.
- [ ] P11-T06-10 Run full end-to-end, security, resilience, and restore tests in
  staging.
- [ ] P11-T06-11 Verify production configuration has no development bypass,
  sample credential, writable sealed mount in Nginx, or public private-service
  endpoint.
- [ ] P11-T06-12 Review unresolved risks and explicitly accepted exceptions.
- [ ] P11-T06-13 Obtain human product, security, operations, and release approval.
- [ ] P11-T06-14 Record commands, versions, timestamps, and results as release
  evidence.

## 16. Standard Validation Commands

Finalize exact commands during P1 after the build and tooling versions are
selected. The expected minimum command set is:

```bash
./gradlew spotlessCheck
./gradlew check
./gradlew test
./gradlew clean build
docker compose config
docker compose build
nginx -t -c /path/to/codomain-nginx.conf
openspec validate --all
```

Additional suites must cover PostgreSQL migrations, broker recovery, real ClamAV,
MCP client compatibility, browser authentication, content-origin isolation,
publication routing, backup restoration, and full end-to-end staging behavior.
Commands that do not exist yet are targets for P1, not evidence that validation
has already passed.

## 17. Completion Record Template

Use this record in the owning OpenSpec task, issue, or pull request for every
completed implementation task:

```text
Task:
Implementation files:
Behavior delivered:
Focused tests:
Full-suite command and result:
Build command and result:
Migration/deployment validation:
Security boundaries checked:
Documentation/ADR updates:
Known gaps or accepted exceptions:
Reviewer:
Date:
```
