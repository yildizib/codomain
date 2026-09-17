# MCP Design

The integration boundary and V1 capabilities. Exact tool names and
request/response schemas will be designed in the relevant OpenSpec change.

## Connection and authorization

An external AI client connects to the authenticated account's single site.
Apply [API key authorization](SECURITY.md#api-keys-and-mcp-authorization) and resolve
ownership server-side. MCP is the entry point for all site operations; execution
follows [application ownership](ARCHITECTURE.md#application-ownership).

V1 uses Spring AI's WebMVC MCP Server starter with Streamable HTTP. The remote
endpoint is protected by the Codomain API-key security layer; the starter's
transport endpoint is not assumed to provide authentication. Legacy HTTP/SSE is
not a V1 transport. STDIO may be reconsidered as a future local adapter, not as
the hosted V1 contract.

## Connection details

Dashboard provides the MCP endpoint, authentication instructions, client configuration
and a downloadable `CODOMAIN_MCP_README.md`. Generated material contains safe key
metadata and secret placeholders, and stays consistent with key rotation/revocation.
Users place the issued key in their client's secret store, not generated documents.

See [Getting started](PRODUCT_REQUIREMENTS.md#getting-started) for account setup.
V1 client support is limited to clients verified against the Streamable HTTP
contract. Client-specific configuration formats remain to be verified and
documented before launch.

## V1 capabilities

| Capability | User-visible result |
| --- | --- |
| Read site context and history | Site/subdomain information, live version, deployments, versions and operation status. |
| Submit files or manage a large upload | An accepted deployment and trackable processing result. |
| Create or renew a preview | Temporary access to validated deployment content or a previous version. |
| Approve reviewed content | An immutable version of the exact approved content. |
| Publish or roll back | A recorded operation selecting the live version. |

Archive/unarchive behavior remains under evaluation. This table defines capability
boundaries, not final tool names or permission to delete retained versions.

## Approval and rollback boundary

Approval and publication are separate domain steps, even if a future tool combines
them. Follow the [lifecycle](ARCHITECTURE.md#deployment-lifecycle) and
[approval integrity controls](SECURITY.md#preview-and-publishing-integrity).
The supported MCP client must show the preview identity and requested action and
ask the user for explicit confirmation. Codomain verifies a short-lived,
single-use challenge bound to the account, actor, artifact digest and action.
Dashboard confirmation is not required. A bare client-supplied boolean is not a
valid proof. [ADR-015](docs/decisions/ADR-015.md) records this decision.

## Large uploads and asynchronous commands

MCP Server owns upload sessions, controlled resumable transfer endpoints and
finalization. Sessions are account/site-bound, limited and expiring. Finalization
verifies completeness and integrity and freezes input before Worker processing.
Small text submissions may be inline; large binaries must not travel inside MCP
JSON or MQ messages. The transfer protocol and client support remain to be designed.

Responses distinguish request acceptance from completion and expose safe progress,
attempts and errors. Identical requests reusing an account-scoped idempotency key
return the original operation; different input with the same key conflicts.
Internal recovery follows [application-owned messaging](ARCHITECTURE.md#application-owned-messaging).

## Error behavior

Errors must be structured and useful without revealing secrets or other accounts.
Distinguish invalid credentials, invalid input, unavailable resources, stale or
conflicting requests, rate limits and processing failures. Foreign resources must
look unavailable; error differences must not reveal cross-account existence.
Exact codes and response fields belong in the tool-contract design.

## Audit expectations

Authentication, credential use and site operations require safe, attributable
history, including failures. Apply [audit controls](SECURITY.md#logging-monitoring-and-response)
and [messaging integrity](SECURITY.md#messaging-integrity). Full payloads and
credentials do not belong in audit records.
