# Product Requirements

This document defines the V1 product requirements for Codomain.

Codomain is a remote MCP publishing platform for static websites. Users bring
their own AI assistant or agent. Codomain receives generated static-site files,
creates previews, manages immutable versions, and publishes the user-approved
version to a live URL.

Codomain does not provide an AI assistant, visual website builder, traditional
hosting panel, or general-purpose deployment platform.

## Product message

```text
Your AI assistant builds the website.
Our publishing platform puts it live.
```

## V1 goal

V1 should let an individual user connect their own AI client to Codomain,
submit one static website through MCP, review a preview, approve publication,
and manage version history for one free subdomain.

## Target user

The V1 user:

- Has access to an AI assistant or agent such as ChatGPT, Claude, Gemini,
  Codex, or another MCP-compatible client.
- Wants the AI assistant to generate static HTML, CSS, JavaScript, and assets.
- Does not want Codomain to provide the AI assistant.
- Wants a simple publishing workflow with preview, approval, versioning, and
  rollback.

## V1 ownership model

```text
One account = one site = one MCP connection
```

Each account owns exactly one site, one free subdomain, and one account-scoped
MCP connection in V1.

## In scope

V1 includes:

- Email, first name, last name, and password registration.
- Terms and Conditions acceptance during registration.
- One free subdomain for each account.
- One static website managed by each account.
- Dashboard access for site and account management.
- MCP connection details shown in the dashboard.
- Downloadable generated `CODOMAIN_MCP_README.md` with product context and MCP
  usage instructions.
- API key creation, revocation, and rotation.
- Automatic generated README and MCP connection template updates when API key
  metadata changes, without embedding the raw key.
- Password change.
- Static file submission through MCP.
- Preview URL generation.
- Authenticated user approval before publication.
- Published URL for the approved version.
- Deployment history.
- Version history.
- Previous-version preview.
- Rollback to a previous immutable version.

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
- Dynamic server-side execution, databases, background workers, and serverless
  functions.

## Primary user journey

1. The user creates an account with email, first name, last name, and password.
2. The user accepts the Terms and Conditions.
3. Codomain creates one site and one free subdomain for the account.
4. The user opens the dashboard.
5. The user creates an API key. The raw value is shown once.
6. The dashboard shows MCP connection details and a downloadable generated
   `CODOMAIN_MCP_README.md` that contains a secret placeholder, not the raw key.
7. The user adds the MCP details to their AI client.
8. The AI agent builds static site files.
9. The AI agent submits the files through MCP and Codomain creates a deployment.
10. Codomain validates the files, seals the accepted artifact with a content
    digest, and creates a time-limited preview URL.
11. The user reviews the preview.
12. The user explicitly approves publication.
13. Codomain creates an immutable version, records a publication event, and
    atomically points the live URL to that version.
14. The user can inspect deployment and version history.
15. The user can preview a previous version and roll back when needed.

## Functional requirements

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

- The dashboard must show site information, free subdomain, preview URL,
  published URL, deployment history, version history, and rollback controls.
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
- A deployment artifact must be sealed before preview and identified by a
  deterministic manifest digest.
- Preview URLs must be time-limited, revocable capability URLs served from an
  origin isolated from the dashboard.
- The system must require explicit authenticated user approval before
  publication.
- Approval must be bound to the exact sealed artifact digest being approved.
- A newer or different deployment must require a separate approval.

### Versioning and publishing

- Approval of a sealed deployment must create an immutable version that retains
  the approved manifest digest.
- Published state must point to an immutable version.
- Every publish attempt must create an auditable publication record separate
  from the version.
- The system must keep deployment and version history.
- The system must show the current published version.
- Failed publication must not replace the previously published version.

### Rollback

- The system must allow the user to preview a previous version.
- The system must allow rollback to a previous immutable version.
- Rollback must update the published version pointer without rewriting the
  selected version's contents.
- Rollback must create a publication record and must not create a new version.

## Non-functional requirements

- The system must follow `SECURITY.md`.
- The system must follow `CODING_STANDARDS.md`.
- The system must keep account and site data isolated.
- The system must avoid exposing API keys, passwords, secrets, private user
  content, or cross-account metadata.
- The system must produce safe audit records for security-sensitive actions.
- All externally reachable production surfaces must use HTTPS.
- The system must preserve the previous live version when preview,
  publication, or rollback fails.

## Acceptance criteria

V1 is acceptable when:

- A user can register, accept Terms and Conditions, and access the dashboard.
- A user receives exactly one free subdomain and one managed site.
- A user can create, revoke, and rotate an API key.
- MCP connection details and generated README content reflect current API key
  metadata without containing the raw secret.
- An authenticated MCP client can submit a valid static site.
- Invalid paths, oversized submissions, and unauthorized MCP requests are
  rejected safely.
- The system creates a preview URL for a valid deployment.
- The preview, approval, version, and publication reference the same artifact
  digest.
- The approved version is published to the live URL.
- Deployment and version history are visible.
- A previous version can be previewed.
- The user can roll back to a previous immutable version.
- Rollback creates a publication record but does not create a new version.
- Revoked or rotated API keys no longer authorize MCP operations.
- Another account cannot access or modify the user's site, files, deployments,
  versions, previews, API keys, or published state.

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
- What is the permanent private security contact?
- What retention period should deployment files, versions, previews, and audit
  records use?
- Which exact MCP transport and client configuration formats will V1 support?
- Will V1 require email verification and password-reset flows before launch?
- What expiration duration and regeneration rules will preview capability URLs
  use?
- What maximum propagation delay is acceptable for API key revocation and
  rotation?
