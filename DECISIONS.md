# Decisions

This document records architecturally significant decisions for Codomain.

Use this file for decisions that shape system structure, ownership boundaries,
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

## ADR-001: Use MCP as the boundary between external AI agents and Codomain

Status: Accepted

Date: 2026-09-09

### Context

Codomain is built for users who already have an AI assistant or
MCP-compatible agent. The external agent creates static website files.
Codomain receives those files, validates them, creates a preview, records
versions, and publishes the user-approved result.

If AI generation were part of Codomain, the architecture would need model
provider integrations, prompt state, generation workflows, provider-specific
errors, and AI safety behavior. Those concerns are separate from publishing.

### Decision drivers

- Keep the product focused on remote publishing.
- Avoid provider-specific AI dependencies in the core domain.
- Let users choose ChatGPT, Claude, Gemini, Codex, or another MCP-compatible
  client.
- Keep preview, approval, versioning, and publication independent from how the
  site was generated.

### Considered options

- Build AI generation into Codomain and integrate model providers directly.
- Expose only a generic upload or deployment API and leave MCP outside the
  product boundary.
- Use MCP as the agent-facing boundary while keeping generation external.

### Decision

Codomain will treat MCP as the boundary between external AI agents and the
platform. The core system will not provide AI generation. It will expose
publishing-domain capabilities through MCP and keep AI-provider behavior out
of the Codomain domain model.

Codomain's architecture will center on account, site, MCP connection,
deployment, preview, version, publication, and rollback.

### Consequences

- MCP tool contracts must describe publishing behavior, not prompt or model
  behavior.
- The dashboard must help users connect an external AI client, not operate an
  internal AI assistant.
- Tests should verify MCP publishing behavior without depending on a specific
  AI provider.
- Adding AI generation later would require a new decision because it changes
  the product boundary and system architecture.

### Revisit when

- Codomain considers hosting AI generation.
- Codomain introduces provider-specific AI workflows.
- MCP stops being the primary integration boundary.

## ADR-002: Model V1 tenancy as one account, one site, and one MCP connection

Status: Accepted

Date: 2026-09-09

### Context

V1 needs a small ownership model that is easy for individual users to
understand and safe to implement. Supporting multiple sites, multiple
subdomains, custom domains, teams, clients, or agency workflows would add
authorization complexity before the core preview and publishing workflow is
proven.

### Decision drivers

- Minimize authorization and routing complexity in V1.
- Keep account, site, and MCP ownership easy to explain in the dashboard.
- Keep future multi-site support possible by preserving explicit concepts.
- Avoid project/team/client scoping before the single-site workflow is proven.

### Considered options

- Implement multi-site tenancy and project-scoped authorization in V1.
- Collapse account and site into one persistence concept.
- Keep account and site distinct while enforcing a V1 one-to-one cardinality
  and exposing one logical MCP connection.

### Decision

V1 will create and manage exactly one site for each account. Each account gets
one free subdomain and one account-scoped MCP connection that controls that
single site.

```text
One account = one site = one MCP connection
```

The data model will keep `Account` and `Site` as separate concepts with an
enforced V1 one-to-one cardinality. `McpConnection` is a logical configuration
derived from account, site, endpoint, and active-key metadata; it does not have
to be a separately mutable persistence entity.

### Consequences

- Dashboard and MCP authorization can be simpler and easier to test.
- Each operation can be scoped to the authenticated account's single site.
- Site lookup, deployment lookup, version lookup, and rollback must all enforce
  ownership through the authenticated account.
- Future multi-site support will require new account-to-site and
  MCP-to-project authorization rules.
- The dashboard should not expose project/team/client selection in V1.

### Revisit when

- Multiple sites per account are introduced.
- Custom domains or multiple subdomains are introduced.
- Team, agency, or client access is introduced.

## ADR-003: Authorize MCP operations through account-scoped API keys

Status: Accepted

Date: 2026-09-09

### Context

The MCP server is called by external AI clients. Those clients may be
misconfigured, compromised, or simply given stale connection details. MCP
requests can also include identifiers, paths, subdomains, deployment IDs, or
version IDs supplied by the client.

Because V1 has one site per account, authorization can be resolved from the
active API key to the owning account and that account's site.

### Decision drivers

- Keep MCP setup simple for the user.
- Avoid trusting client-supplied ownership identifiers.
- Support API key revocation and rotation from the dashboard.
- Keep subdomain routing separate from authorization.

### Considered options

- Reuse browser sessions for MCP clients.
- Adopt delegated OAuth permissions in V1.
- Use account-scoped API keys with server-side ownership resolution.

### Decision

MCP requests must authenticate with an active account API key. V1 permits at
most one active MCP API key per account. Server-side authorization must resolve
the owning account and the account's V1 site from that key.

Client-supplied account IDs, site IDs, deployment IDs, version IDs, subdomains,
paths, and URLs are untrusted hints only. The server must verify ownership
before every MCP operation.

### Consequences

- API keys become the MCP credential boundary for V1.
- API key records need lifecycle state, including creation, revocation, and
  rotation metadata.
- Revoked or rotated keys must stop authorizing MCP requests according to the
  documented lifecycle.
- Generated `CODOMAIN_MCP_README.md` content and MCP connection templates must
  reflect current key metadata without embedding a raw secret. The raw key is
  shown only once when issued.
- Project-scoped, subdomain-scoped, team-scoped, and client-scoped MCP access
  require a future authorization decision.

### Revisit when

- MCP access becomes project-scoped, site-scoped, team-scoped, or
  client-scoped.
- Direct agent publishing is introduced.
- The system needs multiple keys with different permissions per account.

## ADR-004: Separate deployment submission from publication approval

Status: Accepted

Date: 2026-09-09

### Context

AI agents can generate and submit site files, but publication changes a public
URL controlled by the user's account. Allowing the agent to publish directly in
V1 would blur responsibility between generated content and user approval. It
would also make it easier for a bad prompt, stale API key, compromised client,
or retry to push unreviewed content live.

The product promise includes preview before publication.

### Decision drivers

- Keep the user in control of public publication.
- Make preview review a required workflow state.
- Prevent retries or stale agent actions from changing the live site.
- Preserve a clear audit trail for approval and publication.

### Considered options

- Allow an authenticated AI agent to publish directly.
- Let an agent submit content while requiring dashboard approval for the exact
  artifact.
- Require the user to upload and publish files manually outside MCP.

### Decision

MCP may submit static files, create deployments, return preview status, and
request previews for existing versions. Publication requires explicit,
authenticated user approval through Codomain.

Approval must be bound to the manifest digest of the exact sealed deployment
artifact being previewed. A changed or newer artifact requires a separate
deployment, preview, and approval.

### Consequences

- The architecture needs a durable approval record tied to a deployment ID and
  manifest digest.
- Publication APIs must verify that the approved artifact is the same artifact
  being published.
- MCP tools should not expose a direct publish operation in V1.
- Future direct-agent publishing would need a separate approval and trust
  model.

### Revisit when

- A future plan introduces delegated publishing.
- The product adds team approvals or client approvals.
- Users need policy-based auto-publishing for trusted agents.

## ADR-005: Store site versions as immutable artifacts

Status: Accepted

Date: 2026-09-09

### Context

Codomain must support previews, deployment history, version history, and
rollback. A naive publishing model could overwrite a live directory on each
publish, but that makes it difficult to prove which content was approved,
published, previewed, or restored.

Mutable published files also make rollback fragile because the platform would
need to rebuild, copy, or reconstruct older content. That increases the risk
of serving content that is different from what the user originally approved.

### Decision drivers

- Guarantee that approved content cannot change silently.
- Make rollback fast and reliable.
- Make publication and rollback auditable.
- Avoid rebuilding historical versions.
- Keep live publication atomic from the user's perspective.

### Considered options

- Overwrite a mutable live directory on each publication.
- Reconstruct historical content from source deployments during rollback.
- Store immutable, content-identified versions and update a separate published
  pointer.

### Decision

Validated deployment content will be sealed before preview and identified by a
canonical manifest digest. Approval, version creation, and publication must
reference that same digest. Approved site versions will be stored as immutable
artifacts.

Published state will reference one immutable version through a separate mutable
pointer. Publish and rollback actions will create publication records rather
than storing mutable publication state on a version.

Rollback will update the published pointer to a previous immutable version
rather than rewriting that version's contents.

### Consequences

- Storage must support immutable version artifacts and a separate mutable
  published pointer.
- Version records identify their source deployment, canonical manifest, digest,
  and creation time. Current publication state is derived from the site pointer.
- Publication records preserve target version, actor, previous version, reason,
  result, and timestamps.
- Publication and rollback can be atomic from the user's perspective.
- Audit records can identify the exact artifact that was approved, published,
  or restored.
- Storage usage may grow over time, so retention and cleanup policies need a
  future decision.

### Revisit when

- Version storage cost becomes significant.
- Retention policy is defined.
- Dynamic application hosting is introduced.
- CDN or object storage constraints require a different artifact layout.

## ADR-006: Isolate user-controlled content behind ingestion and delivery boundaries

Status: Accepted

Date: 2026-09-09

### Context

Site files arrive through MCP from an external AI client. Even if the user
trusts that client, the platform cannot assume the submitted HTML, CSS,
JavaScript, assets, paths, archives, metadata, or URLs are safe.

Submitted content could contain path traversal attempts, oversized payloads,
unsafe archive structures, malicious scripts, phishing content, or references
to internal platform resources.

### Decision drivers

- Protect account and site isolation.
- Prevent uploaded content from escaping its storage namespace.
- Keep platform credentials and internal services unavailable to user content.
- Support safe preview and publication of externally generated files.

### Considered options

- Store and serve submitted files directly from the platform application.
- Attempt to sanitize arbitrary HTML and JavaScript before serving it from the
  platform origin.
- Validate at a dedicated ingestion boundary and serve user content through an
  isolated content plane.

### Decision

All submitted static-site content and MCP payloads are untrusted input. A
dedicated ingestion boundary must validate ownership, paths, sizes, counts,
archive behavior, subdomains, URLs, and identifiers before sealing an artifact.

Artifact storage must use account/site namespaces. Previewed and published
content must be served through an isolated content plane with no access to
platform administration, platform secrets, private services, or other accounts.

### Consequences

- File intake needs a validation boundary before storage and preview.
- Storage namespaces must prevent cross-account reads and writes.
- Preview and published delivery must not expose platform credentials or
  internal metadata.
- Abuse, suspension, and takedown workflows are necessary because published
  user sites are externally visible user-controlled content.

### Revisit when

- Codomain supports custom server behavior.
- Codomain supports dynamic applications or serverless functions.
- The platform introduces user-controlled network integrations.

## ADR-007: Separate dashboard, preview, and published delivery surfaces

Status: Accepted

Date: 2026-09-09

### Context

Codomain serves both platform UI and user-controlled website content. The
dashboard handles accounts, passwords, API keys, publication approval, and
rollback. Preview and published surfaces serve static content submitted by an
AI agent.

Serving these surfaces through the same trust boundary would increase the
risk that user-provided content affects dashboard sessions, platform routes,
admin behavior, or credentials.

### Decision drivers

- Protect dashboard sessions and account management routes.
- Keep user-controlled content away from platform administration.
- Allow dashboard security headers to differ from published-site headers.
- Make preview and published routing explicit.

### Considered options

- Serve dashboard and user content from the same origin.
- Use different subdomains under one shared registrable domain and rely only on
  route and cookie configuration.
- Separate control-plane and content-plane origins and registrable domains.

### Decision

The architecture will separate dashboard and MCP control-plane traffic from
preview and published content-plane traffic. In production, the control plane
and content plane must use different registrable domains, origins, routing,
headers, credentials, and trust assumptions.

Dashboard cookies must be host-only and must never be sent to content origins.
Preview and published routes serve user-controlled static content without
platform secrets or dashboard authority. Exact production domain names are
deferred until product domains are selected.

### Consequences

- Dashboard security headers can be stricter than published-site headers.
- Preview URLs must identify the deployment or version they represent without
  granting dashboard privileges.
- Published delivery should resolve to the current published version pointer.
- Routing must not use subdomain, preview URL, or published URL ownership as a
  substitute for server-side authorization.

### Revisit when

- Custom domains are introduced.
- Preview authentication or private previews are introduced.
- The platform changes how published content is routed or cached.

## ADR-008: Keep V1 runtime static-site only

Status: Accepted

Date: 2026-09-09

### Context

Codomain's first version needs to prove the AI-agent-to-preview-to-publish
workflow. Supporting dynamic applications would introduce runtime execution,
server-side code isolation, database provisioning, background jobs, secrets
management for user apps, runtime logs, scaling, and a much larger security
surface.

Static-site publishing is enough for the V1 promise.

### Decision drivers

- Reduce runtime and security complexity in V1.
- Avoid executing user-provided server-side code.
- Keep deployment artifacts portable and easy to preview.
- Keep versioning and rollback artifact-based.

### Considered options

- Support general server-side applications in V1.
- Support a restricted serverless runtime alongside static sites.
- Accept and serve static HTML, CSS, JavaScript, and assets only.

### Decision

V1 will support static HTML, CSS, JavaScript, and asset publishing only. It
will not run user-provided server-side code, provision user databases, host
background workers, or provide general-purpose dynamic application deployment.

### Consequences

- File validation, preview, versioning, publication, and rollback can focus on
  static artifacts.
- The platform avoids user-code execution risk in V1.
- MCP tools should describe static-site publishing capabilities, not generic
  deployment capabilities.
- Dynamic application hosting, serverless functions, databases, and background
  workers require future architecture decisions.

### Revisit when

- Users need dynamic routes, server-side functions, or databases.
- The product moves beyond static website publishing.
- Future paid plans require dynamic application deployment.

## ADR-009: Model deployment and publication as explicit state machines

Status: Accepted

Date: 2026-09-10

### Context

Submission, validation, preview creation, approval, version creation, publish,
and rollback may cross process boundaries and can fail or be retried. Boolean
flags and implicit ordering would allow impossible combinations, such as a
published deployment that never passed validation or an approval applied to
changed content.

Concurrent publish and rollback requests could also overwrite newer live state
unless transitions and pointer updates have explicit concurrency protection.

### Decision drivers

- Make lifecycle invariants explicit and testable.
- Support retries without duplicate deployments or publications.
- Prevent stale approval and lost publication updates.
- Preserve the previous live version when processing fails.

### Considered options

- Represent progress with unrelated boolean fields and handler-specific rules.
- Keep the workflow synchronous and rely on request completion for ordering.
- Persist explicit states and validate every transition with idempotency and
  concurrency controls.

### Decision

Deployment and publication use separate persisted state machines:

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

Only documented transitions are valid. Each state-changing operation must be
idempotent. Validation seals the artifact before `PreparingPreview`. Approval
and immutable version creation occur on the `PreviewReady` to `Approved`
transition and retain the same manifest digest. `ValidationFailed` is terminal
for that deployment; preview and publication failures may be retried without
changing the artifact or creating duplicate records.

Submission uses an account-scoped idempotency key; reusing that key with the
same canonical input returns the original deployment, while reuse with
different input fails with a conflict.

Approval stores the actor, timestamp, deployment ID, and manifest digest.
Publication verifies that digest before creating a publication record and
atomically changing the site's published-version pointer. Publish and rollback
must use transactional or compare-and-swap protection so a stale operation
cannot overwrite newer state.

### Consequences

- Workers and APIs share one lifecycle definition rather than inventing local
  state rules.
- Failed validation never creates a preview or version, and preview failure
  never changes the sealed artifact.
- Failed publish or rollback leaves the previous published pointer unchanged.
- Retry and concurrency scenarios require dedicated tests.
- New lifecycle states require an intentional schema and contract change.

### Revisit when

- The workflow introduces queues with materially different delivery semantics.
- Team or multi-step approvals are introduced.
- Publication spans multiple regions or independently consistent stores.

## ADR-010: Use time-limited capability URLs for isolated previews

Status: Accepted

Date: 2026-09-10

### Context

Users need to open deployment and historical-version previews from the
dashboard or after an AI agent requests one. Serving previews only through a
dashboard session would couple untrusted content to the control plane. Permanent
public preview URLs would expose unpublished content indefinitely.

### Decision drivers

- Keep preview content outside the dashboard trust boundary.
- Allow a preview to open in a normal browser without sharing dashboard cookies.
- Limit exposure if a preview URL is copied or leaked.
- Bind every preview to one sealed artifact or immutable version.

### Considered options

- Serve previews inside an authenticated dashboard origin.
- Use permanent public URLs with unguessable identifiers.
- Use revocable, time-limited capability URLs on an isolated content origin.

### Decision

V1 previews will use revocable, time-limited capability URLs served from an
isolated content origin. Each capability grants read-only access to one sealed
deployment artifact or immutable version and grants no dashboard, MCP, account,
or publication authority.

Preview capability values must have sufficient entropy, must not be stored in
analytics or routine request logs, and must be excluded from referrer leakage
where supported. Regenerating a preview creates a new capability; exact default
expiry duration remains a product configuration decision that must be resolved
before implementation.

### Consequences

- Preview delivery can remain independent of dashboard sessions.
- Leaked URLs have bounded lifetime and can be revoked.
- The system needs capability issuance, expiry, revocation, and regeneration
  behavior.
- Preview links are sensitive even though they are not account credentials.

### Revisit when

- Private organization-only previews are introduced.
- Team or client review requires identity-aware preview access.
- Preview delivery moves to a provider that cannot enforce revocation or expiry.
