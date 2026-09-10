# Architecture

The system framework: application ownership, processing, storage and delivery.
[Product requirements](PRODUCT_REQUIREMENTS.md) defines user-visible behavior;
[Security](SECURITY.md) defines trust boundaries; [Decisions](DECISIONS.md) records
rationale. Detailed implementation designs belong in the relevant OpenSpec change.

## System boundaries

Use three independently deployable Java / Spring Boot monoliths. Dashboard uses
Spring MVC; Deployment Worker runs continuously rather than as a per-request CLI.

```mermaid
flowchart TB
  U["User"] --> D["Dashboard"]
  U --> C["External AI client"] --> M["MCP Server"]
  subgraph control["Private control plane"]
    D --> DB[("PostgreSQL · application-owned records")]
    M --> DB
    D -->|"Own committed messages"| Q["MQ"]
    M -->|"Own committed messages"| Q
    Q --> W["Deployment Worker"]
    W --> DB
    W -->|"Own result messages"| Q
    Q -->|"Operation results"| M
    W --> S["Isolated validation and scanning"]
  end
  subgraph files["Private NFS"]
    IN["Quarantine"]
    OUT["Sealed artifacts"]
  end
  M -->|"Uploads"| IN
  IN --> S
  W -->|"Validated content"| OUT
  OUT -->|"Read-only mount"| N["Nginx · separate content VPS"]
  U -->|"Preview"| N
  V["Site visitors"] --> N
```

The database box represents logical ownership, not a selected server/schema
layout. Account events reach relevant consumers; Worker does not consume every
Dashboard event. NFS access does not make all stored artifacts publicly accessible.

## Application ownership

| Application | Responsibility |
| --- | --- |
| Dashboard | Registration, sessions, account/password management, API keys and MCP connection instructions. No site-operation controls. |
| MCP Server | All site commands and status queries, deployment acceptance, large uploads and request idempotency. |
| Deployment Worker | Durable processing, validation, sealing, preview preparation, version creation, publication, rollback and cleanup. |

## Domain model

| Concept | Meaning |
| --- | --- |
| Account / Site | Separate concepts with one site per V1 account. |
| API key / MCP connection | Account access and derived connection information. |
| Deployment | An accepted submission and its processing history, including failures. |
| Artifact | A fixed set of validated files identified by a canonical manifest digest. |
| Preview | Temporary read access to one sealed artifact or existing version. |
| Approval | The user's decision bound to the exact reviewed artifact. |
| Version | A permanent, immutable reference to approved content. |
| Publication | A recorded request to make a version live or restore an older version. |

## Deployment lifecycle

```mermaid
flowchart TB
  U["MCP submission"] --> V["Worker validates and scans"]
  V -->|"Rejected or incomplete"| F["No preview or version"]
  V -->|"Passed"| S["Seal content and prepare preview"]
  S --> P["Preview available through MCP"]
  P --> A["User approval through MCP"]
  A --> VER["Worker creates immutable version"]
  VER --> PUB["Publication request through MCP"]
  OLD["Existing version"] -->|"Rollback request through MCP"| PUB
  PUB --> APPLY["Worker applies publication"]
  APPLY -->|"Success"| LIVE["Selected version is live"]
  APPLY -->|"Failure"| KEEP["Previous live version retained"]
```

This is the conceptual workflow, not an assertion that a DB write alone updates
Nginx delivery. Deployment, job execution and publication have separate progress.
The accepted state-transition baseline is retained in [ADR-009](docs/decisions/ADR-009.md).
Retries must not duplicate effects or overwrite newer state. Rejected content
requires a new deployment; transient processing failures may be retried safely.

### Upload and validation flow

MCP accepts the deployment before content validation and owns large-file transfer.
Finalized input is frozen in quarantine, validated and scanned in isolation.
Only successfully checked content can be sealed and previewed. ClamAV is proposed,
not selected; [scanning controls](SECURITY.md#isolated-scanning) apply regardless
of engine. Transfer details belong in [MCP design](MCP_DESIGN.md#large-uploads-and-asynchronous-commands).

### Publication and rollback

Approval creates a version of the exact sealed content. Publication and rollback
select a version through the site's live pointer; neither rewrites version files.
Rollback creates a publication record without creating another version.

Publication requests, failed attempts and technical retries must remain auditable.
A retried request must not create duplicate publication effects. The detailed
record boundary between a publication, its attempts and precondition rejections
remains to be specified before implementation; the wording in ADR-009 does not
remove the [product audit requirement](PRODUCT_REQUIREMENTS.md#versioning-and-publishing).

## Application-owned messaging

```mermaid
sequenceDiagram
  participant App as Source application
  participant DB as Source database
  participant MQ as MQ
  participant W as Worker
  participant WD as Worker database
  App->>DB: Commit business intent and outbox INSERT together
  App->>MQ: Send app-name:outboxId
  MQ-->>App: Broker confirmation
  App->>DB: Append delivery confirmation
  MQ->>W: Deliver message
  W->>WD: Commit inbox and durable job
  W->>MQ: ACK
  W->>W: Execute recoverable work
  W->>WD: Commit result and Worker outbox together
  W->>MQ: Send result
```

- Each application sends and recovers its own committed messages. There is no
  separate outbox relay. Startup and periodic recovery handle unconfirmed sends.
- All outboxes are insert-only, including Worker results. Attempts, errors and
  confirmations go in a separate append-only journal. Inbox/job and domain state
  may change; normal application roles cannot update or delete outbox rows.
- Delivery can repeat. Preserve `app-name:outboxId` and payload across retries;
  use a stable logical app name and globally unique outbox ID, not a replica name.
- Worker owns durable, shared inbox/job storage and records it before ACK.
  Recover interrupted jobs and deduplicate effects, including file operations.
- Preserve source, actor, operation and related-message identities with safe
  attempt/error history. Result consumers deduplicate and reject stale updates.
- Request idempotency is separate from message identity. MQ carries bounded
  metadata and file references, never uploaded bytes or raw credentials.

[ADR-012](docs/decisions/ADR-012.md) retains the detailed messaging decision.
Broker confirmation means delivery acceptance, not completed business processing.

## Storage expectations

### Directory-backed artifacts and versions

PostgreSQL stores metadata; ordinary private NFS directories store file bytes.
Directory names locate content; manifest digests identify the exact approved
bytes. Storage permissions enforce immutability. Git or object storage is not
required for versioning.

A preview and a permanent version may reference the same sealed artifact without
copying large files at approval. A version must never depend on temporary files
that cleanup can remove. File preparation and DB updates are separate operations:
recovery and cleanup coordination must prevent incomplete or deleted references.

### Retention and archive

Apply the [product retention policy](PRODUCT_REQUIREMENTS.md#retention-and-archive).
Cleanup protects active work and version references; expired temporary content
does not erase deployment history. Permanent retention also requires backups and
tested restoration. [ADR-013](docs/decisions/ADR-013.md) records storage decisions
and the still-unconfirmed archive proposal.

## Runtime and content delivery

Nginx runs on a separate VPS and mounts only sealed NFS content read-only; it
never mounts quarantine. PostgreSQL uses its own durable storage, not NFS.
Control-plane and content-plane domains and privileges remain isolated under
[Security](SECURITY.md#preview-and-publishing-integrity).

Delivery exposes only the current live version or a valid preview capability.
Live routing is unresolved between DB-backed resolution and an edge projection.
DB and edge changes are not one transaction; the publication design must define
when content is actually live, preserve failure guarantees, and handle stale
updates, caches and outages. The current topology does not promise high availability.

Containerized deployment is intended. Docker Compose is recommended for initial
management simplicity; Kubernetes has not been ruled out or selected.

## Remaining implementation decisions

Resolve these in the OpenSpec change for the affected capability, before its
implementation. They do not block unrelated work or imply selected defaults.

| Before working on | Resolve |
| --- | --- |
| Account and MCP integration | Product account policies, transport/client support, credential revocation and human-confirmation proof. |
| Messaging and Worker | Broker, DB ownership/layout, message contracts, retry/ordering policy and recoverable job execution. |
| Upload and cleanup | Transfer protocol, limits, scanner/signature policy, retention scope and archive behavior. |
| Publication and operations | Live routing, publication/attempt records, availability, cache behavior, backups and audit/message retention. |
| Runtime packaging | Container orchestration and exact Java/Spring versions. |

Keep current scope and guarantees in these overview documents. Use OpenSpec for
schemas, protocols, detailed failure scenarios, acceptance tests and implementation
tasks; add an ADR when that work changes a significant architecture decision.
