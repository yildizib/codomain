# MCP Design

Canonical AI integration contracts. Concrete schemas and transport remain to
be finalized; the proposed tools below define V1 capability boundaries.

## Connection and authorization

The connection targets the authenticated account's site, not a separate config
per subdomain. Apply [API key authorization](SECURITY.md#api-keys-and-mcp-authorization)
and resolve resource ownership server-side.

For setup, see [Getting started](PRODUCT_REQUIREMENTS.md#getting-started).
The [publishing journey](README.md#how-it-works) describes the user flow;
[application ownership](ARCHITECTURE.md#application-ownership) defines execution responsibilities.

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

Exact schemas remain implementation decisions. All resources are restricted to
the authenticated account; responses follow the safety rules above.

| Tool | Request / purpose | Expected response |
| --- | --- | --- |
| `get_site_context` | Read the account's site context. | Safe site name/ID, subdomain, live URL, latest preview if available, current version, deployment/version status, static-file constraints. |
| `submit_static_site` | Manifest, static files, account-scoped idempotency key; optional message and client metadata. | Deployment ID, validation and preview status, preview URL when ready, safe warnings/errors. |
| `get_deployment_status` | Inspect an owned deployment. | Deployment ID, validation/preview/approval status, version ID if created, preview URL when available, safe warnings/errors. |
| `list_versions` | List the site's versions. | IDs, labels/numbers, creation timestamps, current-pointer indicator, source deployments, rollback eligibility. |
| `preview_version` | Request a preview of an owned immutable version. | Version ID, preview URL and status. Does not publish. |
| `get_publish_status` | Read current publication state. | Live URL, current version, last publication timestamp, publication record, target version, safe status. |
| `list_deployments` | Read owned deployment history. | Deployment IDs, progress and safe results. |
| `create_upload_session` | Begin a large-file submission with request idempotency. | Deployment/upload ID, controlled transfer details and limits. |
| `finalize_upload` | Verify and freeze an owned completed upload. | Accepted operation ID and processing status. |
| `preview_deployment` | Create or renew preview access to owned sealed content. | Operation status and capability URL when ready. |
| `approve_deployment` | Approve the exact owned deployment digest under the pending confirmation policy. | Operation ID; version ID when completed. |
| `publish_version` | Request publication of an owned approved version. | Operation/publication ID and status. |
| `rollback_version` | Request rollback to an owned immutable version. | Publication ID and status; no new version. |

Tool names and splitting/combining approval and publication are proposals, not
final wire contracts. Archive/unarchive capabilities remain under evaluation;
no archive semantics or deletion authority are implied by this table.

Submission creates a deployment after authentication and basic acceptance,
before content validation. Follow [upload security](SECURITY.md#static-file-and-upload-security)
before sealing or preview.

## Approval and rollback boundary

Approval and publication remain separate domain steps even if a future tool
combines them. Follow the [deployment lifecycle](ARCHITECTURE.md#deployment-lifecycle),
[publication and rollback semantics](ARCHITECTURE.md#publication-and-rollback),
and [approval integrity controls](SECURITY.md#preview-and-publishing-integrity).
The human-confirmation proof remains unresolved; select it before implementing
these tools. [ADR-011](docs/decisions/ADR-011.md) records the MCP-only boundary.

## Large uploads and asynchronous commands

Small text files may use inline content. MCP Server owns large upload-session
creation, controlled resumable HTTP transfer and finalization. The HTTP endpoints
belong to the same application. Bind sessions
to the authenticated account/site, enforce expiry and quotas, and verify chunks,
completeness and integrity before freezing input. No post-finalization writes are
allowed. Confirm client-side HTTP upload support and the exact protocol before
implementation; large binaries must not be placed in MCP JSON or MQ payloads.

Asynchronous responses distinguish accepted requests from completed operations.
Status queries return safe progress, attempts and errors for owned operations.
State-changing requests reject stale transitions with `conflict`. Identical
requests reusing an account-scoped idempotency key return the original operation;
different input with the same key returns `conflict`.

Internal delivery identities, source tracking, recovery and result deduplication
follow [application-owned messaging](ARCHITECTURE.md#application-owned-messaging).
Upload modes converge on the same canonical manifest under the
[upload and validation flow](ARCHITECTURE.md#upload-and-validation-flow).

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

Apply [logging and audit controls](SECURITY.md#logging-monitoring-and-response)
and [message identity controls](SECURITY.md#messaging-integrity).

Future scope is tracked in [Product requirements](PRODUCT_REQUIREMENTS.md#out-of-scope-for-v1).
Permanent public preview URLs are outside V1.
