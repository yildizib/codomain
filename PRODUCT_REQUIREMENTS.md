# Product Requirements

Canonical V1 scope and acceptance criteria. [README](README.md) introduces the
product; [Architecture](ARCHITECTURE.md) defines lifecycle semantics.

## Scope

One account owns one static site, one free subdomain, and one account-scoped
MCP connection. V1 serves individuals who bring their own AI client.

## Out of scope for V1

V1 excludes AI hosting, visual site building, dynamic application hosting and
customer server-side code, databases, workers or serverless functions. It also
excludes multiple sites/subdomains, custom domains, project-scoped MCP connections,
teams, client/agency access, multi-step approvals, white-label publishing,
autonomous publication without user approval, and account self-deletion.

## Getting started

Register and accept Terms, receive or choose a free subdomain, then use Dashboard
to create an API key and configure an external AI client. Continue with the
[publishing journey](README.md#how-it-works). Subdomain selection and account
verification policies remain open.

## Requirements and acceptance

### Account and registration

- Register with email, first name, last name and password; record accepted Terms
  version and timestamp before completing registration.
- Support sign-in, sign-out and password changes with protected sessions and
  defined session expiration/revocation behavior.

### Site and subdomain

- Create one account-owned site and one free subdomain, displayed in Dashboard.
- Prevent cross-account access to site data, files, deployments, versions and previews.

### Dashboard

- Provide account and access management only. All site operations and their
  status/history belong to MCP.
- Provide connection instructions and a downloadable integration README as
  defined in [MCP connection details](MCP_DESIGN.md#connection-details).
- Support API key creation, revocation and rotation, with at most one active key.
  Show the raw key only when issued; show safe metadata afterward.

### MCP submission

- The MCP connection must be scoped to the authenticated account and its single
  V1 site.
- The MCP server must allow an authenticated AI client to submit static HTML,
  CSS, JavaScript, and asset files.
- The system must validate submitted file paths, sizes, file counts, and
  content boundaries before artifact acceptance, sealing, or preview.
- The system must create a deployment record after an authenticated submission
  passes basic request acceptance and before content validation begins.
- A deployment must record validation failures without creating a preview or
  version.

### Preview and approval

- The system must generate a preview URL before publication.
- The preview must represent a specific deployment or version.
- The system must allow preview creation/renewal and previous-version preview
  requests through MCP.
- Previewed content must be fixed before review and must not change afterward.
- Preview URLs must be time-limited, revocable capability URLs served from an
  origin isolated from the dashboard.
- Require explicit user approval through MCP under
  [approval integrity controls](SECURITY.md#preview-and-publishing-integrity).
- Approval must apply only to the exact content the user reviewed.
- A newer or different deployment must require a separate approval.

### Versioning and publishing

- Approval must create an immutable version of the reviewed content.
- Published state must point to an immutable version.
- Publication requests and their attempts, including failures, must be auditable
  separately from immutable versions. Retrying an operation must not duplicate
  its publication effects.
- The system must expose the current published version and deployment/version
  history through MCP.
- Failed publication must not replace the previously published version.

### Rollback

- The system must allow MCP-originated rollback to a previous immutable version.
- Rollback must restore the selected version without changing its contents.
- Rollback must create a publication record and must not create a new version.

### Processing reliability

- MCP must support controlled large-file uploads.
- Submitted content must pass validation and isolated malware scanning before
  preview becomes available. Incomplete scanning must not count as success.
- Accepted operations must survive service interruptions and support safe retries
  without duplicate deployments, versions or publications.
- MCP must expose operation progress, attempts, safe errors and success. Operation
  history must retain the originating application and initiating identity.
- Request acceptance must be distinguishable from successful completion.

Implementation is defined in [application-owned messaging](ARCHITECTURE.md#application-owned-messaging)
and [upload processing](ARCHITECTURE.md#upload-and-validation-flow).

### Retention and archive

- Keep the last 10 temporary deployment contents; do not automatically delete
  approved versions. Per-site unversioned scope is proposed, pending confirmation.
- Cleanup must protect active work and content retained by a version. Expiring
  temporary files must preserve deployment history and report preview unavailability.
- Archive behavior remains under evaluation and does not authorize version deletion.

See [storage and cleanup mechanics](ARCHITECTURE.md#retention-and-archive).

## Quality requirements

Acceptance also requires [Security](SECURITY.md) and
[Coding standards](CODING_STANDARDS.md), including safe upload rejection,
revoked-key rejection, account isolation, and safe audit records.
Preview, publication, or rollback failure must preserve the previous live site.

## Success metrics

Measure completion of account/MCP setup and the submission-to-preview-to-publication
journey, along with rollback and credential-management success. Detailed telemetry
belongs in the corresponding implementation work; security monitoring follows
[Security](SECURITY.md#logging-monitoring-and-response).

## Open questions

- What is the final product domain and free subdomain pattern?
- Should free subdomains be user-selected, generated, or both?
- What file size, file count, and total deployment limits should V1 enforce?
- What static file types should be accepted by default?
- Confirm the scope of the last-10 temporary-content policy and quarantine expiry.
- What archive behavior should MCP expose?
- How is explicit human approval established through MCP?
- What live-site availability and recovery objectives should V1 meet?
- Will V1 require email verification and password-reset flows before launch?
- What expiration duration and regeneration rules will preview capability URLs
  use?
- What maximum propagation delay is acceptable for API key revocation and
  rotation?
- Is any consent beyond Terms and Conditions acceptance required?

Technical choices are tracked in [Architecture](ARCHITECTURE.md#remaining-implementation-decisions)
and [MCP design](MCP_DESIGN.md#connection-details). Security reporting is defined
in [Security](SECURITY.md#reporting-a-vulnerability).
