# Agent Instructions

## Product context

Codomain is a remote MCP publishing platform for static websites. The user
provides an AI assistant or agent; Codomain receives the generated HTML, CSS,
JavaScript, and asset files, creates a preview, manages versions, and publishes
the approved site.

The product message is:

> Your AI assistant builds the website. Our publishing platform puts it live.

Codomain must not be described or implemented as an AI provider, visual site
builder, general-purpose deployment platform, or hosting control panel.

## V1 invariants

Preserve these constraints unless the user explicitly changes product scope:

- One account owns one site.
- One account uses one account-scoped MCP connection.
- Each account receives one free subdomain.
- Site publishing follows `Build → Deployment → Validation → Sealed preview →
  User approval → Immutable version → Publication`.
- Every accepted submission creates a deployment record. Publish and rollback
  create publication records; rollback reuses an existing version.
- Previous versions can be previewed and rolled back.
- API key creation, revocation, and rotation must update the generated
  `CODOMAIN_MCP_README.md` and MCP connection template automatically without
  embedding the raw key.
- A site must never be published without explicit preview approval.

## Engineering guidance

- Keep account, site, MCP authorization, deployment, preview, version, and
  publication boundaries explicit so the V1 model can later expand to multiple
  sites and teams.
- Seal deployment artifacts before preview and bind preview, approval, version,
  and publication to the same manifest digest.
- Treat versions as immutable. Rollback should create a publication event that
  selects an existing version rather than mutate its contents.
- Enforce authorization server-side for every MCP and dashboard operation.
- Isolate files, previews, deployments, and credentials by account and site.
- Never log API keys or include secrets in generated documentation, source
  control, test fixtures, or user-visible error messages.
- Validate static-site files and paths before artifact acceptance, sealing,
  preview, or publication; quarantine unvalidated bytes and prevent path
  traversal or unsafe cross-account access.
- Keep provider-specific AI behavior out of the publishing domain. MCP is the
  integration boundary, not an AI implementation dependency.
- Prefer small, testable changes that preserve the documented workflow.

## Security requirements

The baseline security concerns and reporting guidance are documented in
[`SECURITY.md`](SECURITY.md). Read it before changing authentication, MCP
authorization, API keys, file uploads, previews, deployments, URLs, storage,
versioning, or publishing behavior.

At a minimum:

- Enforce authorization server-side for every account and site operation.
- Keep accounts, site files, previews, deployments, versions, and credentials
  isolated from one another.
- Treat API keys as secrets.
- Treat submitted site files and MCP payloads as untrusted input.
- Validate file paths, sizes, archive contents, and user-controlled URLs.
- Require approval for the exact sealed manifest digest being published.
- Keep versions immutable and make rollback select an existing version.
- Add security-focused tests for changes that affect these boundaries.
- Never expose credentials in logs, URLs, screenshots, generated README files,
  source control, or user-facing errors.

## Documentation and communication

- All repository content, code comments, identifiers, user-facing copy, and
  documentation must be written in English, even when the request is made in
  Turkish or another language.
- Use the product terminology summarized in `README.md` and the more precise
  lifecycle semantics in the specialized architecture documents.
- When adding a feature, document its scope, authorization behavior, lifecycle,
  and impact on versioning.
- Clearly label functionality outside V1 as future scope rather than silently
  adding it.

### Documentation authority

Use the specialized document as the source of truth for its subject:

- Product scope and acceptance criteria: `PRODUCT_REQUIREMENTS.md`
- Architecture decisions: `DECISIONS.md`
- Logical system structure and lifecycle: `ARCHITECTURE.md`
- MCP capabilities and contracts: `MCP_DESIGN.md`
- Security requirements: `SECURITY.md`
- Coding and quality rules: `CODING_STANDARDS.md`
- Contribution and Git workflow: `CONTRIBUTING.md`
- Public product summary: `README.md`

If summaries drift, correct the summary to match the authoritative specialized
document. Do not resolve a conflict by silently weakening a requirement.

## Coding standards

Baseline coding standards are documented in
[`CODING_STANDARDS.md`](CODING_STANDARDS.md). Read it before changing
application code, tests, scripts, configuration, generated documentation, or
agent-authored implementation details.

At a minimum:

- Keep changes small, focused, maintainable, and easy to review.
- Follow clean code, clean architecture, KISS, YAGNI, single-responsibility,
  and maintainability principles.
- Use product terminology consistently across code, tests, and documentation.
- Use the naming conventions documented in `CODING_STANDARDS.md` unless the
  selected language or framework requires a different established convention.
- Keep trust boundaries explicit for accounts, sites, MCP authorization,
  deployments, previews, versions, publishing, and rollback.
- Treat external input, MCP requests, uploaded files, and generated site
  content as untrusted.
- Add focused tests for changed behavior and security-sensitive boundaries.
- Run the full available test suite at the end of each task and build when the
  change affects runtime, packaging, deployment, generated output, or
  user-facing behavior.
- Do not call a task complete until required checks pass or any verification
  gap is explicitly documented.
- Document behavior, setup, security, API, MCP, or deployment changes when they
  affect contributors or users.

## Architecture and MCP design

Baseline architecture is documented in [`ARCHITECTURE.md`](ARCHITECTURE.md).
Remote MCP behavior is documented in [`MCP_DESIGN.md`](MCP_DESIGN.md). Read
these documents before changing account/site ownership, dashboard flows, MCP
tools, deployment intake, preview behavior, publishing, versioning, rollback,
storage, or authorization boundaries.

At a minimum:

- Preserve the V1 model: one account, one site, one MCP connection.
- Keep MCP as the integration boundary with external AI agents.
- Do not implement Codomain as an AI provider or general deployment platform.
- Keep publication behind explicit authenticated user approval.
- Keep approved versions immutable and rollback pointer-based.
- Treat submitted site files and MCP payloads as untrusted input.
- Label multi-site, custom-domain, team, agency, and direct-agent-publish
  behavior as future scope unless explicitly approved.

## Product requirements and decisions

V1 product requirements are documented in
[`PRODUCT_REQUIREMENTS.md`](PRODUCT_REQUIREMENTS.md). Architecturally
significant decisions are recorded in [`DECISIONS.md`](DECISIONS.md). Read
these documents before changing product scope, user journeys, acceptance
criteria, authorization models, deployment behavior, MCP capabilities,
versioning, rollback, or future-scope boundaries.

At a minimum:

- Keep implementation aligned with the accepted V1 requirements.
- Do not silently add out-of-scope V1 behavior.
- Record important architecture, security-boundary, authorization, storage,
  MCP, deployment, versioning, rollback, or platform-surface decisions in
  `DECISIONS.md`.
- Supersede an existing decision with a new entry instead of silently changing
  historical decision context.

## OpenSpec workflow

- Use the repository's OpenSpec configuration for product and architecture
  changes.
- Read the relevant OpenSpec artifacts before implementing a planned change.
- Keep implementation aligned with the approved proposal, design, specs, and
  tasks. Surface scope or design conflicts instead of silently narrowing them.
- Validate the relevant OpenSpec artifacts after changes.

## Git Flow and contribution workflow

Detailed Git Flow, branch naming, issue-based development, commit messages,
pull requests, releases, and human review responsibilities are documented in
[`CONTRIBUTING.md`](CONTRIBUTING.md). Read that document before making changes.

At a minimum:

- Never commit directly to `main` or `develop`.
- Work from an issue-specific `feature/*`, `bugfix/*`, `hotfix/*`, or
  `release/*` branch.
- Include the issue ID in commit subjects using the `#ID: imperative subject`
  format.
- Use pull requests for all changes; humans retain approval and merge control.
- Keep multi-task features on one issue, one branch, and one pull request with
  separate task-level commits.
- Follow the release procedure in `CONTRIBUTING.md` for version tags and
  back-merging `main` into `develop`.

## Verification expectations

Before considering an implementation complete:

- Verify authentication and authorization behavior.
- Verify API key lifecycle behavior, including revoked and rotated keys.
- Verify preview approval is required before publication.
- Verify version immutability, history, preview, and rollback.
- Verify account/site isolation and unsafe path handling.
- Run the repository's available formatting, static analysis, and test checks.

## Optional graphify workflow

The repository may contain a generated knowledge graph under `graphify-out/`.
Use graphify only when `graphify-out/graph.json` exists or the user explicitly
requests graph generation.

When the user types `/graphify`, use the installed graphify skill or
instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when
  `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for
  relationships and `graphify explain "<concept>"` for focused concepts.
- Dirty `graphify-out/` files are expected after hooks or incremental updates;
  dirty graph files are not a reason to skip graphify.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead
  of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or
  when query, path, or explain does not surface enough context.
- After modifying code, run `graphify update .` only when an existing graph is
  present or the user requested graph generation.
