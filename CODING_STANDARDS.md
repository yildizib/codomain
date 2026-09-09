# Coding Standards

This document defines the baseline coding standards for Codomain. It applies
to application code, tests, scripts, configuration, generated documentation,
and agent-authored changes.

These standards are intentionally framework-neutral until the product stack is
finalized. When a framework or language is selected, add focused conventions
for that stack without weakening the baseline rules in this document.

## Core principles

- Keep changes small, focused, and easy to review.
- Preserve the V1 product model documented in `PRODUCT_REQUIREMENTS.md` and the
  accepted architecture decisions in `DECISIONS.md`.
- Keep account, site, MCP authorization, deployment, preview, version,
  publication, and rollback boundaries explicit.
- Prefer clear, boring, maintainable code over clever abstractions.
- Add abstractions only when they reduce real duplication or clarify an
  established boundary.
- Make behavior testable through narrow units and user-facing workflows.
- Treat external input, MCP requests, uploaded files, and generated site
  content as untrusted.

## Design principles

- Follow clean code practices: write code that is readable, explicit, and easy
  to change.
- Follow clean architecture practices: keep business rules independent from
  delivery mechanisms, frameworks, databases, and external services.
- Apply KISS: choose the simplest design that solves the current problem
  safely.
- Apply YAGNI: do not build future-scope functionality until the product scope
  explicitly requires it.
- Apply DRY carefully: remove stable, harmful duplication without creating an
  abstraction before the shared behavior is understood.
- Apply single responsibility: each module, class, function, component, and
  service should have one clear reason to change.
- Avoid unnecessary duplication. Extract shared behavior only when the
  duplication is real, stable, and harmful to maintainability.
- Prefer composition and clear boundaries over large inheritance chains or
  deeply coupled abstractions.
- Keep public interfaces small and intentional.
- Make dependencies flow inward toward the product domain. Outer layers may
  depend on inner layers; core domain logic should not depend on delivery,
  storage, UI, or infrastructure details.
- Optimize for maintainability, reviewability, and long-term correctness before
  local cleverness or short-term convenience.

## Language and naming

- Write all repository content in English.
- Use clear, descriptive names for files, modules, functions, variables,
  classes, database fields, API fields, and tests.
- Prefer names that reflect the product domain, such as `account`, `site`,
  `deployment`, `version`, `preview`, `publication`, `rollback`, `apiKey`, and
  `mcpConnection`.
- Avoid abbreviations unless they are widely understood in the codebase or the
  product domain.
- Keep names consistent with the terminology in `README.md`.
- Use PascalCase for types, classes, interfaces, components, and other
  type-like declarations when the selected language supports that convention.
- Use camelCase for variables, functions, methods, properties, and parameters
  when the selected language supports that convention.
- Use UPPER_SNAKE_CASE for constants that represent fixed global values.
- Use lowercase kebab-case for branch names, URL slugs, and user-facing
  subdomain examples.
- Use lowercase snake_case only when required by a selected language,
  framework, database, protocol, or existing code convention.
- Name boolean values as clear predicates, such as `isPublished`,
  `hasApprovedPreview`, or `canRollback`.
- Name tests after the behavior they prove, not only the function they call.

## Code organization

- Separate dashboard, authentication, MCP, file handling, deployment,
  preview, publishing, versioning, and rollback concerns.
- Keep authorization checks close to the operation they protect.
- Keep storage paths, public URLs, and internal identifiers clearly separated.
- Keep platform logic separate from AI-provider behavior. Codomain integrates
  through MCP; it must not depend on a specific AI assistant or model provider.
- Keep V1 single-site assumptions explicit so future multi-site support can be
  added intentionally.

## Security and trust boundaries

- Follow `SECURITY.md` for authentication, authorization, API keys, uploads,
  previews, publishing, rollback, and incident handling.
- Never log, commit, display, or expose passwords, API keys, tokens, secrets,
  private user content, or raw sensitive payloads.
- Validate all user-controlled file paths, archive entries, URLs, subdomains,
  identifiers, and request payloads before use.
- Do not trust account IDs, site IDs, version IDs, or paths supplied by a
  client without server-side ownership checks.
- Bind preview, approval, version creation, and publication to the same sealed
  manifest digest.
- Make rollback select an existing immutable version rather than rewriting
  version contents.

## Error handling

- Return user-facing errors that are clear, safe, and actionable.
- Do not reveal whether private accounts, sites, keys, previews, or versions
  exist through error messages.
- Preserve enough internal context for debugging without logging secrets or
  sensitive payloads.
- Handle failed uploads, previews, publishing attempts, and rollbacks without
  leaving partial live state.
- Model deployment and publication transitions explicitly and make retried
  state-changing operations idempotent.

## Tests and validation

- Add or update tests for every feature, bug fix, and security-sensitive
  change.
- Cover authentication, authorization, key lifecycle, tenant isolation, path
  validation, preview approval, version immutability, publishing, and rollback
  behavior when those areas change.
- Prefer focused tests that prove the boundary being changed.
- Run the repository's available formatter, static analysis, tests, and
  relevant build checks before marking work complete.
- Run the full available test suite at the end of each task unless there is a
  documented reason it cannot run.
- Build the project when the change affects runtime behavior, packaging,
  deployment, generated output, or any user-facing workflow.
- Do not report a task as complete until required tests, checks, and builds
  have passed or the remaining verification gap is explicitly documented.
- When the stack is not yet established, document the validation that was
  possible and what remains unverified.

## Documentation

- Update documentation when behavior, setup, security posture, workflows,
  environment variables, API contracts, MCP tools, or deployment behavior
  changes.
- Use Markdown for documentation unless a specific artifact requires another
  format.
- Keep examples free of real secrets, private URLs, production credentials, and
  personally identifiable information.
- Clearly label future-scope behavior instead of silently mixing it into V1.

## Dependencies and configuration

- Add dependencies only when they solve a real product or engineering need.
- Prefer mature, maintained packages with clear licenses and active security
  practices.
- Keep runtime configuration outside source control and use environment or
  secret-management facilities for sensitive values.
- Do not commit generated local state, build artifacts, dependency caches, or
  machine-specific configuration.

## Agent-authored changes

- Read `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, and this document before
  making code changes.
- Keep edits scoped to the user's request and the relevant issue.
- Preserve unrelated user changes in the working tree.
- Do not create commits, branches, pull requests, releases, or production
  changes unless the user explicitly requests them.
- Explain validation clearly when handing work back to the user.
