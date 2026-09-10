# Coding Standards

Applies to code, tests, scripts, configuration, and generated output. These
rules are framework-neutral until the implementation stack is selected.

## Design and organization

- Keep changes small, readable, and easy to review; apply KISS and YAGNI.
- Keep business rules independent of frameworks, delivery, and storage.
  Dependencies flow inward toward the domain.
- Give modules one responsibility and keep public interfaces narrow.
- Prefer composition; extract abstractions for established, harmful duplication.
- Follow the boundaries and terminology in [Architecture](ARCHITECTURE.md).
- Keep authorization close to each protected operation. Apply [Security](SECURITY.md)
  to external input, credentials, URLs, files, and delivery.
- Keep storage paths, public URLs, and internal identifiers distinct.
- Make errors actionable and safe; retain useful internal debugging context.
- Model state changes and retries according to the documented lifecycle.

## Naming

Use descriptive domain names and predicate names for booleans, such as
`isPublished` or `canRollback`. Name tests after the behavior they prove.

| Kind | Default |
| --- | --- |
| Types, classes, interfaces, components | PascalCase |
| Variables, functions, methods, properties, parameters | camelCase |
| Fixed global constants | UPPER_SNAKE_CASE |
| Branches, URL slugs, subdomain examples | lowercase kebab-case |

Use established language, framework, database, or protocol conventions when they
differ, including snake_case where required. Avoid unfamiliar abbreviations.

## Validation

- Add or update focused tests for features, bug fixes, and security-sensitive changes.
- Cover affected authentication, authorization, key lifecycle, isolation, path
  validation, approval, immutability, and rollback boundaries.
- Run available formatting, static analysis, and the full test suite at the
  end of each task; document any reason a required check cannot run.
- Run a relevant build for runtime, packaging, deployment, generated output,
  or user-facing behavior changes.
- Report completion only after checks pass or an explicit verification gap is
  documented. Until a stack exists, report the checks that are possible.

## Documentation and configuration

- Update the document that owns changed scope, behavior, setup, security,
  lifecycle, contracts, environment variables, or versioning impact.
- Use Markdown unless an artifact requires another format. Link to canonical
  requirements instead of copying them. Label future scope explicitly.
- Keep examples free of secrets, private URLs, credentials, and personal data.
- Add dependencies for a concrete need; prefer maintained packages with
  clear licenses and active security practices.
- Keep sensitive runtime settings in environment or secret-management facilities.
- Exclude generated local state, build output, caches, and machine-specific config
  from version control.

## Agent changes

Follow [AGENTS](AGENTS.md) and [Contributing](CONTRIBUTING.md). Preserve unrelated
user work. Do not create commits, branches, pull requests, releases, or production
changes unless the user explicitly requests them. Explain validation at handoff.
