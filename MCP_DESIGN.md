# MCP Design

This document defines the baseline MCP design for Codomain V1.

Codomain exposes a remote MCP connection so a user's external AI assistant can
submit static website files, request previews, inspect deployment/version
state, and prepare content for user approval. Codomain does not provide the AI
assistant. MCP is the integration boundary between the user's chosen AI client
and Codomain's publishing platform.

## V1 MCP model

V1 uses one account-scoped MCP connection:

```text
One account = one site = one MCP connection
```

The user does not create a separate MCP config for each subdomain. The MCP
connection manages the single site attached to the authenticated account.

## Authentication

- MCP requests must authenticate with the account's active API key.
- API keys must be generated, revoked, and rotated from the dashboard. V1
  permits at most one active MCP API key per account.
- Revoked or rotated keys must stop authorizing new MCP requests within the
  documented maximum propagation window; the design target is the next
  authorization decision.
- MCP tools must resolve account and site ownership server-side.
- MCP requests must not trust client-supplied account IDs, site IDs,
  deployment IDs, version IDs, subdomains, paths, or URLs without
  authorization checks.
- Authorization failures must not reveal whether another account, site,
  deployment, version, or key exists.

## Connection details

The dashboard should provide:

- MCP server URL.
- Required authentication method.
- Active API key metadata and creation or rotation instructions. The raw key is
  displayed only once when issued.
- Copyable MCP client configuration.
- Downloadable generated `CODOMAIN_MCP_README.md` with product context, usage
  instructions, and a secret placeholder.
- Guidance for rotating or revoking keys.

When API key state changes, generated README content and the MCP connection
template must update automatically without embedding the raw secret. The user
must place the newly issued key in the AI client's secret configuration.

## Tool principles

- Tools should be small, explicit, and scoped to the authenticated account's
  single V1 site.
- Tool names should describe publishing-domain behavior rather than AI-client
  behavior.
- Tool responses should be structured, stable, and safe to display in an AI
  client.
- Tools must never return API keys, secrets, private platform URLs, or other
  sensitive internals.
- Tools that create or mutate state must define and enforce idempotency
  behavior.
- Tools must return clear errors without leaking cross-account information.

## Proposed V1 tools

The exact MCP schema will be finalized during implementation. These tool names
describe the expected V1 capability boundaries.

### get_site_context

Returns safe context for the authenticated account's site.

Expected output:

- Site name or identifier safe for display.
- Free subdomain.
- Published URL.
- Latest preview URL if one exists.
- Current published version.
- High-level deployment/version status.
- Static-site constraints and file expectations.

This tool must not return secrets or raw API keys.

### submit_static_site

Submits a static website deployment for validation and preview.

Expected input:

- File manifest.
- HTML, CSS, JavaScript, and asset files.
- Account-scoped idempotency key.
- Optional deployment message.
- Optional client metadata.

Expected output:

- Deployment ID.
- Validation status.
- Preview status.
- Preview URL when available.
- Safe warnings or errors.

The deployment record is created after authentication and basic request
acceptance, before content validation. The submitted files remain untrusted.
The platform must validate paths, file types, sizes, archive behavior, and
ownership before sealing the artifact or creating a preview.

The concrete transfer mechanism may use inline content for small text files and
a controlled two-phase upload for larger or binary assets. Its schema, limits,
and integrity checks must be finalized before implementation; all transfer
modes must produce the same canonical manifest and digest.

### get_deployment_status

Returns status for a deployment owned by the authenticated account.

Expected output:

- Deployment ID.
- Validation status.
- Preview status.
- Approval status.
- Version ID if a version has been created.
- Preview URL when available.
- Safe error or warning details.

### list_versions

Lists versions for the authenticated account's single site.

Expected output:

- Version IDs.
- Version labels or numbers.
- Created timestamps.
- Whether the version is the current published-pointer target.
- Source deployment IDs.
- Rollback eligibility.

### preview_version

Creates or returns a preview URL for an existing immutable version owned by the
authenticated account.

Expected output:

- Version ID.
- Preview URL.
- Preview status.

This tool does not publish the version.

### get_publish_status

Returns the current publication state for the authenticated account's site.

Expected output:

- Published URL.
- Current published version.
- Last publication timestamp.
- Current publication record and target version.
- Safe publication status.

## User approval boundary

MCP may submit files and create previews, but publication requires explicit,
authenticated user approval in Codomain.

V1 should not allow an AI agent to publish directly without the user's approval
unless a future product decision introduces a separate, explicit approval
model. Approval must be bound to the exact sealed artifact digest being
published.

## File submission rules

- Accept only static-site files required for HTML, CSS, JavaScript, and assets.
- Reject absolute paths, path traversal, invalid encodings, ambiguous path
  normalization, and writes outside the assigned site namespace.
- Enforce limits for request size, file count, file size, total deployment
  size, and archive expansion.
- Handle duplicate paths deterministically and safely.
- Treat all submitted content as untrusted.
- Do not allow submitted content to access platform credentials, internal
  metadata, private network services, or other tenants.

## Preview behavior

- Every successfully validated submission must create a sealed artifact before
  preview.
- Preview URLs must be isolated from dashboard administration and other
  accounts.
- Preview URLs must be revocable, time-limited capabilities and must not confer
  dashboard or MCP authority.
- Previewed content must not receive platform secrets.
- Preview state must show which deployment or version it represents.
- A preview must not become live through retries, predictable URLs, race
  conditions, or direct API calls.

## Version and rollback behavior

- Approved deployments create immutable versions.
- Published state must point to a version rather than mutable files.
- Rollback must select a previous immutable version.
- Publish and rollback create publication records separate from versions.
- MCP may request a preview for a previous version, but rollback must require
  an authenticated dashboard action unless a future product decision defines a
  separate approval model.

## Error behavior

MCP errors should be safe, structured, and useful:

- `unauthorized`: the API key is missing, invalid, revoked, or rotated.
- `forbidden`: the authenticated account is known to have the target but lacks
  permission for the requested action.
- `validation_failed`: submitted files or metadata failed validation.
- `not_found`: the requested deployment or version is not available to this
  account.
- `conflict`: the requested operation conflicts with current deployment,
  approval, publish, or rollback state.
- `rate_limited`: the account or key exceeded allowed request volume.
- `internal_error`: the platform failed without exposing implementation
  details.

Error responses must not leak account existence, site existence, private
identifiers, secrets, or cross-account metadata.

Requests for resources outside the authenticated account must return the same
externally observable result as an unavailable resource. They must not use the
`forbidden`/`not_found` distinction to reveal cross-account existence.

## Audit expectations

Record safe audit events for:

- MCP authentication success and failure.
- API key use, revocation, and rotation.
- Deployment submission.
- Validation success and failure.
- Preview creation.
- Version creation.
- Publication approval.
- Publication.
- Version preview.
- Rollback.

Audit records must not contain plaintext API keys, passwords, secrets, or full
sensitive payloads.

## Lifecycle and concurrency

- Deployment status follows the states defined in `ARCHITECTURE.md`.
- State-changing requests must reject stale transitions with a safe `conflict`
  response.
- Reusing a submission idempotency key with identical input returns the
  original deployment; reusing it with different input returns `conflict`.
- Approval records the manifest digest. Publication must compare that digest
  with the sealed artifact and version before updating live state.
- Concurrent publish or rollback requests must not overwrite a newer published
  pointer without detecting the conflict.

## Future scope

These MCP capabilities are outside V1:

- Multiple MCP connections per account.
- Project-specific MCP connections.
- Subdomain-specific MCP configs.
- Team or client-scoped MCP access.
- AI-agent direct publishing without a separately approved authorization model.
- Custom-domain management through MCP.
- Dynamic application deployment.
- Permanent public preview URLs.
