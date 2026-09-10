# Product Requirements

Canonical V1 scope and acceptance criteria. [README](README.md) introduces the
product; [Architecture](ARCHITECTURE.md) defines lifecycle semantics.

## Scope

One account owns one static site, one free subdomain, and one account-scoped
MCP connection. V1 serves individuals who bring their own AI client.

## Out of scope for V1

V1 does not include:

- AI model hosting or AI assistant features.
- Visual drag-and-drop site building.
- General-purpose deployment workflows.
- Dynamic application hosting.
- Multiple sites per account.
- Multiple subdomains per account.
- Custom domains.
- Project-specific MCP connections.
- Team members.
- Client-level access.
- Agency workflows.
- Multi-step approval workflows.
- White-label publishing.
- Direct AI-agent publication without explicit user approval.
- Account self-deletion.
- Customer-provided dynamic server-side execution, databases, background workers,
  and serverless functions.

## Getting started

```mermaid
flowchart TB
  subgraph account["1 · Account"]
    A{"Have an account?"} -->|No| B["Register and accept Terms"]
    A -->|Yes| C["Sign in"]
    B --> D["Receive or choose a free subdomain"]
    D --> E["Open dashboard"]
    C --> E
  end
  subgraph connect["2 · Connect your AI"]
    E --> F["Create an API key"]
    F --> G["Download integration README and connection details"]
    G --> H["Configure AI client and its secret store"]
  end
  classDef actor fill:#dbeafe,stroke:#2563eb,color:#172554;
  classDef platform fill:#ede9fe,stroke:#7c3aed,color:#2e1065;
  class A,B,C,H actor;
  class D,E,F,G platform;
```

Adapted from the supplied Excalidraw concept. Subdomain selection and account
verification remain open decisions. See [README](README.md#how-it-works) for
the subsequent publishing journey.

## Requirements and acceptance

### Account and registration

- The system must allow registration with email, first name, last name, and
  password.
- The system must require Terms and Conditions acceptance before account
  creation completes.
- The system must store the accepted Terms version and timestamp.
- The system must allow authenticated users to change their password.
- The system must allow registered users to authenticate, end their session,
  and access the dashboard through a protected browser session.
- The system must define session expiration and revocation behavior.

### Site and subdomain

- The system must create one site for each V1 account.
- The system must assign or allow selection of one free subdomain for the
  account.
- The system must show the free subdomain in the dashboard.
- The system must prevent one account from accessing another account's site,
  subdomain, files, deployments, versions, or previews.

### Dashboard

- The dashboard must provide account and access management only. It must not
  initiate deployment, preview, approval, publication, rollback or version
  management. Site status and history are exposed through MCP.
- The dashboard must show MCP connection details.
- The dashboard must provide a downloadable generated
  `CODOMAIN_MCP_README.md` with safe MCP usage instructions and secret
  placeholders.
- The dashboard must allow API key creation, revocation, and rotation.
- The dashboard must update README and MCP connection details when the API key
  changes.
- The dashboard must show a raw API key only at creation or rotation time and
  must show only safe key metadata afterward.
- V1 must allow no more than one active MCP API key per account.

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
- The system must return safe deployment and preview status through MCP.
- Retried submissions with the same idempotency key must not create duplicate
  deployments.

### Preview and approval

- The system must generate a preview URL before publication.
- The preview must represent a specific deployment or version.
- The system must allow preview creation/renewal and previous-version preview
  requests through MCP.
- Previewed content must be fixed before review and must not change afterward.
- Preview URLs must be time-limited, revocable capability URLs served from an
  origin isolated from the dashboard.
- Approval, publication and rollback must be requested through authenticated
  MCP operations, never dashboard actions. Explicit user approval remains
  required; the mechanism for proving it through MCP is unresolved and must be
  selected before implementation. An API key alone does not prove human review.
- Approval must apply only to the exact content the user reviewed.
- A newer or different deployment must require a separate approval.

### Versioning and publishing

- Approval must create an immutable version of the reviewed content.
- Published state must point to an immutable version.
- Every publish attempt must create an auditable publication record separate
  from the version.
- The system must keep deployment and version history.
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

Suggested V1 product metrics:

- Successful account creation rate.
- MCP connection setup completion rate.
- Successful deployment submission rate.
- Preview generation success rate.
- Preview-to-publication approval rate.
- Publication success rate.
- Rollback success rate.
- API key rotation and revocation success rate.

Operational and security telemetry should separately track:

- Cross-account authorization attempts and denials.
- Failed deployment validation reasons.
- Preview capability expiration and revocation failures.
- Publication and rollback state-transition failures.

## Open questions

- What is the final product domain and free subdomain pattern?
- Should free subdomains be user-selected, generated, or both?
- What file size, file count, and total deployment limits should V1 enforce?
- What static file types should be accepted by default?
- Confirm the scope of the last-10 temporary-content policy; define quarantine
  and preview expiry while retaining approved versions.
- What archive behavior should MCP expose?
- How is explicit human approval established through MCP?
- What live-site availability and recovery objectives should V1 meet?
- Will V1 require email verification and password-reset flows before launch?
- What expiration duration and regeneration rules will preview capability URLs
  use?
- What maximum propagation delay is acceptable for API key revocation and
  rotation?
- What additional consent, if any, does the sketch's “Other Conditions” mean?

Technical choices are tracked in [Architecture](ARCHITECTURE.md#remaining-implementation-decisions)
and [MCP design](MCP_DESIGN.md#connection-details). Security reporting is defined
in [Security](SECURITY.md#reporting-a-vulnerability).
