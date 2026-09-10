# Security Guidelines

Required trust boundaries for accounts, MCP and user-controlled content.
Implementation checklists and test scenarios belong in the relevant OpenSpec
change; they must preserve these controls. Lifecycle mechanics belong in
[Architecture](ARCHITECTURE.md).

## Authentication and account security

Protect browser sessions with secure, HttpOnly, appropriately scoped cookies,
CSRF protection and controlled expiry/revocation. Re-authenticate or invalidate
sensitive sessions after password changes as appropriate. Use adaptive password
hashing; never retain plaintext passwords. Rate-limit and monitor account and
credential operations without revealing whether an email is registered.

## API keys and MCP authorization

Generate cryptographically random keys, store non-recoverable representations,
and show plaintext only when issued. Require recent authentication for key
creation, rotation and revocation. Every MCP operation resolves account/site
ownership server-side; client identifiers are not authority.

Revoked or rotated keys must stop authorizing requests within the documented
propagation window, targeting the next authorization decision. Never place keys
in URLs, logs, analytics, screenshots, exceptions, repository files or generated
connection documents. External clients use their supported secret store.

## Account and site isolation

Enforce ownership across application, storage and delivery boundaries. Client
IDs, paths, subdomains and URLs cannot authorize access to another account.
Errors, resource lookups and routing must not disclose private account/resource
existence. Preview capabilities authorize only their specific content.

## Subdomain security

Use an allowlist for names and lengths, reserve platform/administrative/abuse-prone
names, and keep ownership account-bound. Define release, suspension, rename and
reuse behavior before supporting those transitions. Availability checks and DNS
must not expose private account information.

## Static-file and upload security

Treat all submitted content as untrusted. Normalize and validate paths before
storage; reject traversal, absolute or ambiguous paths, unsafe encodings, links,
special files and duplicate normalized paths. Enforce request, file-count,
file-size, total-size and archive-expansion limits, including archive-bomb defenses.

Quarantine unvalidated content and prevent writes outside the assigned namespace.
Customer code must not execute in platform processing or access credentials,
private services, metadata endpoints or other tenants. Delivery must use safe
content types and content-disposition handling.

### Isolated scanning

- Freeze input before bounded, isolated validation and scanning. Limit CPU,
  memory, disk and time; provide only the job's input, no platform credentials,
  restricted network access and separately controlled signature updates.
- Scan every file to be served. Timeouts, exceeded limits, unreadable/encrypted
  archives and stale signatures are not clean results. Block preview until
  validation succeeds; infrastructure failures may be retried.
- Retain engine/signature identity, time, result and artifact digest. Scanned
  content must not change before sealing, approval or delivery.
- ClamAV is proposed in [ADR-013](docs/decisions/ADR-013.md), not a final engine
  selection. Antivirus never replaces isolation or abuse handling. Later rescans
  may disable access but must not mutate retained versions.
- Keep scanner interfaces and NFS private. Nginx may mount only sealed content
  read-only, never quarantine; other writers must also respect sealing.

## Messaging integrity

Enforce outbox and delivery-journal immutability with database privileges: normal
application roles may read/insert, never update/delete. Administrative retention
requires a separate decision. Authenticate MQ producers/consumers, restrict their
permissions and validate message schemas and source identity.

Recheck ownership and valid lifecycle transitions before effects. Queued sensitive
operations need an authorization-freshness policy so delayed account events cannot
bypass key revocation. Preserve safe actor/correlation identities; neither raw
credentials nor preview capability secrets belong in logs or message metadata.

## Preview and publishing integrity

Serve user content on origins and registrable domains separate from Dashboard,
with no dashboard cookies, credentials or control-plane authority. Dashboard
cookies remain host-only and use the `__Host-` prefix where supported.

Explicit user approval must bind the exact sealed artifact digest. An API key or
client-supplied boolean alone is not proof of human review; define the MCP
confirmation mechanism before implementing approval/publication/rollback.
Preserve [immutable versions and publication guarantees](ARCHITECTURE.md#publication-and-rollback),
including protection against changed content, races, retries and direct URL access.

Previews use expiring, revocable capabilities for one artifact/version. Prevent
secret leakage through logs, analytics and referrers. Regeneration creates a new
capability; it grants no site-management authority.

## Published-site abuse and takedown

Provide monitored, auditable suspension/takedown for malware, phishing and other
abuse or Terms violations. Staff enforcement/restoration requires strong
authorization. Publishing or rollback must not bypass enforcement restrictions;
retain the evidence required for investigation.

## Web and infrastructure security

Require production HTTPS, least-privilege service identities, private backend
networks and separate environment credentials. Protect metadata services against
SSRF. Encrypt sensitive data in transit/at rest and maintain patched, scanned
dependencies and base images.

Review Dashboard CSP/security headers and restrictive control-plane CORS separately
from user-content delivery headers. Never trust a content origin as a Dashboard
origin. Runtime routing must preserve these boundaries during failures.

## Logging, monitoring, and response

Keep attributable, modification-resistant history of security and site operations,
including actors, targets, timestamps and outcomes. Exclude secrets and full
sensitive payloads; define retention for support, security and compliance needs.
Monitor authentication/key abuse, unusual publishing, invalid uploads and
cross-account access attempts. Define incident handling that revokes compromised
keys and contains affected deployments before broader investigation.

## Secure development requirements

Review security impact and test affected authentication, authorization, isolation,
credential, upload, preview and publication boundaries under
[Coding standards](CODING_STANDARDS.md#validation). Use managed secrets or environment
configuration. Never weaken controls merely to make a test or deployment pass.

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
