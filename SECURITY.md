# Security Guidelines

This document defines the baseline security expectations for Codomain. It
covers the account, dashboard, remote MCP, static-file, preview, and
publishing surfaces described in V1.

## Security objectives

Codomain must protect:

- Account credentials and personal information
- API keys and MCP access
- Site files and deployment metadata
- Preview and published environments
- Isolation between accounts and sites
- The integrity of approved versions and rollback targets

## Authentication and account security

- Store passwords using a strong, modern, adaptive password-hashing algorithm.
- Never store or log plaintext passwords.
- Require Terms and Conditions acceptance during registration and retain the
  acceptance record with its version and timestamp.
- Apply rate limits and abuse detection to registration, login, password
  changes, API-key operations, and MCP authentication.
- Invalidate or re-authenticate sensitive sessions after password changes when
  appropriate.
- Use secure, HttpOnly, and appropriately scoped cookies for browser sessions.
- Protect state-changing browser requests against CSRF.
- Avoid revealing whether an email address is registered in authentication
  error messages.

## API keys and MCP authorization

- Generate API keys with a cryptographically secure random source.
- Store only a secure hash or otherwise non-recoverable representation of an
  API key when the plaintext is not required after creation.
- Display a newly created or rotated key only once, when it can be safely
  delivered to the authenticated account owner.
- Scope every key to exactly one account and its V1 site.
- Revoked or rotated keys must stop authorizing new requests within the
  documented maximum propagation window; the design target is the next
  authorization decision.
- Never place API keys in logs, analytics, URLs, screenshots, exception
  messages, committed files, generated documentation, or platform-stored
  connection templates. User-managed AI clients must store keys through their
  supported secret facility.
- Authenticate and authorize every MCP operation server-side. Do not trust
  account or site identifiers supplied by the client.
- Return generic authorization failures that do not disclose account or site
  existence.
- Require recent authentication for API key creation, rotation, and revocation.

## Account and site isolation

- Enforce ownership checks for every dashboard, MCP, preview, deployment,
  version, and rollback operation.
- Use defense-in-depth isolation at the application, storage, and delivery
  layers.
- Ensure object identifiers cannot be used to access another account's data
  through enumeration or substitution.
- Treat subdomains, preview URLs, and published URLs as untrusted input when
  resolving ownership or routing requests.
- Do not allow one site's files, scripts, metadata, or deployment records to be
  read or modified through another site's APIs.

## Subdomain security

- Validate requested subdomain names with a strict allowlist of safe characters
  and length limits.
- Reserve platform, administrative, support, security, and commonly abused
  subdomain names so they cannot be claimed by users.
- Treat subdomain ownership as account-bound metadata, not as proof of
  authorization by itself.
- Define a clear lifecycle for released, deleted, suspended, or renamed
  subdomains before allowing reuse.
- Avoid exposing private account information through subdomain lookup,
  availability checks, DNS behavior, or error messages.

## Static-file and upload security

- Reject path traversal, absolute paths, invalid encodings, and ambiguous path
  normalization.
- Normalize and validate every submitted path before storage.
- Prevent uploaded files from writing outside the site's assigned storage
  namespace.
- Define and enforce limits for request size, file count, individual file size,
  total deployment size, and archive expansion.
- Handle archives defensively, including protection against archive bombs and
  duplicate-file collisions.
- Treat uploaded HTML, CSS, JavaScript, and assets as untrusted content.
- Seal validated artifacts before preview, compute a deterministic manifest
  digest, and prevent content changes after sealing.
- Prevent uploaded content from accessing platform credentials, internal
  metadata, private network services, or other tenants.
- Use safe content-disposition and content-type handling when serving files.

## Preview and publishing integrity

- Serve previews and published user content from content-plane origins that do
  not share the dashboard's registrable domain, origin, or session cookies.
- Keep dashboard cookies host-only and use the `__Host-` prefix where supported.
- Do not expose secrets or internal service endpoints to previewed sites.
- Require an explicit, authenticated user approval for every publication.
- Bind approval to the sealed artifact's manifest digest; approval must not
  silently apply to changed, newer, or different content.
- Make versions immutable after creation.
- Record who approved, published, or rolled back a version, together with
  timestamps and relevant deployment identifiers.
- Rollback must select a known immutable version and must not rewrite its
  contents.
- Prevent unapproved previews from becoming live through predictable URLs,
  race conditions, retries, or direct API calls.
- Make preview capability URLs time-limited and revocable, prevent them from
  granting control-plane authority, and avoid recording their secret tokens in
  logs or analytics.

## Published-site abuse and takedown

- Treat published user sites as externally visible, user-controlled content.
- Monitor and respond to abuse patterns such as phishing, malware delivery,
  impersonation, spam, illegal content, or Terms and Conditions violations.
- Provide a documented path to suspend, unpublish, or disable access to abusive
  content while preserving the audit trail needed for review.
- Separate abuse handling from normal rollback so enforcement actions cannot be
  bypassed by publishing or restoring another version.
- Ensure platform staff tools for suspension, takedown, or restoration require
  strong authorization and produce audit records.

## Web and infrastructure security

- Enforce HTTPS for all externally reachable dashboard, MCP, preview, and
  published traffic in production.
- Configure strict security headers for the dashboard, including a carefully
  reviewed Content Security Policy.
- Configure restrictive CORS for control-plane APIs and never trust a content
  origin as a dashboard origin.
- Review preview and published-site headers separately from dashboard headers
  because user-provided static sites may require a different policy.
- Keep platform services, databases, object storage, and deployment workers on
  private networks where possible.
- Use least-privilege service identities and separate production credentials
  from development credentials.
- Protect internal metadata services and prevent server-side request forgery
  from user-controlled URLs or deployment integrations.
- Keep dependencies and base images patched and scan them regularly.
- Encrypt sensitive data in transit and at rest according to its sensitivity.

## Logging, monitoring, and response

- Log security-relevant events without logging secrets or full sensitive
  payloads.
- Monitor authentication failures, key abuse, unusual publishing volume,
  repeated path-validation failures, and cross-tenant authorization failures.
- Make audit records resistant to accidental modification and retain only what
  is needed for security, support, and compliance.
- Define an incident process for credential compromise, tenant isolation bugs,
  malicious uploads, and unauthorized publication.
- Revoke affected keys and contain affected deployments before investigating
  broader impact.

## Secure development requirements

- Add tests for authentication, authorization, tenant isolation, key lifecycle,
  path validation, preview approval, and rollback behavior.
- Review security impact when changing MCP tools, file handling, URL routing,
  deployment workers, or version state transitions.
- Keep secrets out of source control and use environment or secret-management
  facilities for runtime configuration.
- Do not weaken these requirements to make a test, preview, or deployment pass.

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in public issues. Use the
repository's GitHub **Security** tab and select **Report a vulnerability** when
private vulnerability reporting is enabled. If that option is unavailable,
contact the maintainers through an established private channel. A permanent
security address or private advisory process must be published before the first
production release.

Include the affected area, reproduction steps, impact, and any relevant logs or
identifiers that do not contain secrets. Do not include API keys, passwords, or
private user content in the report.
