# Architecture

This document describes the baseline architecture for Codomain V1.

Codomain is a remote MCP publishing platform for static websites. Users bring
their own AI assistant or agent. Codomain receives generated HTML, CSS,
JavaScript, and asset files through MCP, validates and seals deployment
artifacts, creates isolated previews, stores immutable versions, and publishes
approved versions to a live URL.

Codomain is not an AI provider, visual site builder, general-purpose hosting
panel, or general deployment platform.

## V1 architecture model

V1 follows a deliberately small ownership model:

```text
One account = one site = one MCP connection
```

This model must remain explicit in code and data structures. Future support
for multiple sites, custom domains, teams, agencies, or client access must be
introduced through intentional product and architecture changes.

## System surfaces

Codomain has four primary surfaces:

- Dashboard: the authenticated browser interface where users manage their
  account, site, subdomain, API key, preview, published URL, deployments,
  versions, rollback, generated `CODOMAIN_MCP_README.md` download, and password.
- Remote MCP server: the account-scoped integration boundary used by external
  AI clients to send files, request previews, inspect deployments, and ask for
  version previews.
- Preview delivery: the isolated non-live environment where a submitted
  deployment can be reviewed before publication.
- Published delivery: the public environment that serves the approved version
  at the user's free subdomain.

Dashboard and MCP are control-plane surfaces. Preview and published delivery
are content-plane surfaces. In production, control-plane and content-plane
traffic must use different registrable domains so user-controlled content
cannot share an origin or cookie boundary with account administration.

## Logical components

- Dashboard application: handles browser authentication, account management,
  API key lifecycle, approval, publication, and rollback actions.
- Control API: enforces account/site authorization and coordinates domain
  operations for the dashboard.
- MCP gateway: authenticates API keys, validates MCP contracts, applies rate
  limits, and resolves the account and site server-side.
- Deployment service: creates deployment records and enforces lifecycle state
  transitions and idempotency.
- Ingestion and validation worker: normalizes paths, validates limits and file
  rules, builds the manifest, computes its digest, and seals accepted artifacts.
- Artifact storage: stores deployment and version content in account/site
  namespaces and prevents mutation after sealing.
- Metadata store: persists accounts, sites, key metadata, deployments,
  approvals, versions, publication events, and audit events.
- Preview delivery: serves sealed artifacts or immutable versions through
  time-limited capability URLs on an isolated content origin.
- Published delivery: resolves the site's current published-version pointer and
  serves the referenced immutable version on the public content origin.
- Audit pipeline: records security-sensitive and lifecycle events without raw
  secrets or full sensitive payloads.

## Core domains

### Account

An account represents a registered user with email, first name, last name,
password credentials, Terms and Conditions acceptance, session state, and API
key lifecycle controls.

### Site

A site represents the single V1 static website owned by an account. It has one
free subdomain, one current published version, and deployment/version history.

### MCP connection

The MCP connection is the logical configuration through which an AI client
accesses the account's single V1 site. It is derived from account, site,
endpoint, and active-key metadata and does not have to be a separately mutable
database entity. It is not subdomain-specific in V1.

### Deployment

A deployment is the operational record created after an authenticated
submission passes basic request acceptance. It records the submitter,
idempotency key, lifecycle state, validation result, manifest digest, preview
state, timestamps, and safe failure information. A deployment that fails
validation does not create a preview or version.

### Version

A version is an immutable, content-identified state of a site. Versions are
created from approved sealed deployments and retain the approved manifest
digest. They can be previewed, published, or selected as rollback targets.
Version contents and manifests must not be rewritten after creation.

### Preview

A preview is a non-live rendering of a sealed deployment artifact or historical
version. V1 preview access uses a revocable, time-limited capability URL on an
isolated content origin. A preview URL grants access only to its referenced
artifact and never grants dashboard or MCP authority.

### Publication

Publication is an auditable event that makes an approved immutable version live
at the account's published URL. It atomically updates the site's published
pointer. Rollback is a new publication event targeting an existing version; it
does not create or modify a version.

## High-level workflow

```text
User creates account
        ↓
Codomain creates one site and one free subdomain
        ↓
Dashboard provides MCP connection details and generated integration README
        ↓
User adds MCP details to an external AI client
        ↓
AI agent builds static files
        ↓
AI agent submits files with an idempotency key through MCP
        ↓
Codomain creates a deployment and validates the files
        ↓
Codomain seals the artifact, records its digest, and creates a preview URL
        ↓
User reviews and approves the preview in the dashboard
        ↓
Codomain verifies the digest and creates an immutable version
        ↓
Codomain records a publication and atomically updates the live pointer
```

## Boundary rules

- Dashboard authentication and MCP authentication are separate entry points,
  but both must resolve to the same account and site ownership model.
- Every dashboard and MCP operation must perform server-side authorization.
- Client-supplied account IDs, site IDs, version IDs, deployment IDs, paths,
  subdomains, and URLs must be treated as untrusted input.
- Uploaded HTML, CSS, JavaScript, and assets are user-controlled content.
- Control-plane and content-plane surfaces must not share an origin or session
  cookie boundary.
- Platform secrets, internal services, deployment workers, and storage must
  never be exposed to previewed or published sites.
- Preview approval must apply only to the exact sealed artifact digest being
  approved.

## Lifecycle state machines

Deployments and publication attempts use separate persisted state machines.
Approval and immutable version creation complete before a publication attempt
begins.

```text
Deployment:
Received → Validating → PreparingPreview → PreviewReady → Approved
               ↓               ↓
       ValidationFailed   PreviewFailed ──retry──┘

Publication:
Requested → Applying → Succeeded
                ↓
              Failed ──retry──┘
```

- Only documented state transitions are allowed.
- A transition must be idempotent and reject stale or incompatible state.
- Validation seals the artifact before entering `PreparingPreview`.
- The `PreviewReady` to `Approved` transition records approval and creates the
  immutable version against the same manifest digest.
- `ValidationFailed` is terminal for that deployment; corrected content creates
  a new deployment.
- `PreviewFailed` and failed publication attempts may be retried without
  changing the sealed artifact or creating duplicate records.
- Repeated submissions with the same account-scoped idempotency key return the
  original deployment rather than creating a duplicate.
- Approval stores the actor, timestamp, deployment ID, and manifest digest.
- Publication verifies the approved digest before changing live state.
- Concurrent publication and rollback operations must use transactional or
  compare-and-swap protection for the site's published pointer.
- A failed publish or rollback leaves the previous pointer unchanged.

## Data model expectations

The exact database schema is future implementation detail, but V1 should keep
these concepts explicit:

- Account: identity, credentials, Terms acceptance, security state.
- Site: owner account, free subdomain, lifecycle state, current published
  version.
- API key: owner account, key hash, lifecycle state, created/revoked/rotated
  timestamps.
- MCP connection: a logical projection of account, site, endpoint, and
  active-key metadata used to generate client configuration.
- Deployment: submitted file manifest, validation result, preview reference,
  lifecycle state, idempotency key, manifest digest, source metadata, and audit
  timestamps.
- Approval: actor, deployment, manifest digest, decision, and timestamp.
- Version: immutable file manifest, deployment source, version number or ID,
  content digest, and creation timestamp.
- Publication: target version, actor, reason, previous version, result, and
  timestamps.
- Audit event: actor, action, target, timestamp, result, and safe metadata.

## Storage expectations

- Store each account and site in an isolated namespace.
- Store deployment files separately from published pointers.
- Seal accepted deployment artifacts before preview and identify them with a
  deterministic manifest digest.
- Publish by moving or updating a pointer to an immutable version, not by
  rewriting version contents.
- Keep generated `CODOMAIN_MCP_README.md` and MCP connection templates derived
  from current account and API key metadata without embedding raw keys.
- Do not store plaintext API keys after creation unless a future design
  explicitly requires it and documents the risk.

## Reliability expectations

- Failed uploads must not create partial live state.
- Failed previews must not publish content.
- Failed publication must leave the previous published version live.
- Rollback must be atomic from the user's perspective.
- Retried MCP operations must be idempotent and must not publish unapproved
  content.
- Deployment, version, publication, and rollback operations must produce audit
  records.

## Security expectations

Architecture changes must follow `SECURITY.md`. Pay special attention to:

- Authentication and session safety.
- API key generation, storage, revocation, and rotation.
- Account and site isolation.
- Static file and path validation.
- Preview isolation.
- Explicit approval before publication.
- Version immutability.
- Abuse, suspension, and takedown behavior for published user sites.

## Future scope

These capabilities are not part of V1:

- Multiple sites per account.
- Multiple subdomains per account.
- Custom domains.
- Project-specific MCP connections.
- Client-specific access.
- Team members.
- Multi-step approval workflows.
- White-label publishing.
- General-purpose deployment support beyond static websites.

Future architecture should extend the V1 model without weakening the preview,
approval, versioning, rollback, authorization, and isolation guarantees.
