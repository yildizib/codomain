# Contributing to Codomain

This document contains the Git Flow, issue, pull request, release, and quality
rules for Codomain. Read it before starting work.

## Git Flow

Codomain uses an issue-based Git Flow:

```text
main (production)
  ↑
  └── hotfix/*
        ↓
develop (integration)
  ↑
  ├── feature/*
  ├── bugfix/*
  └── release/*
```

Never commit directly to `main` or `develop`. All changes must be made on a
branch and merged through a pull request.

### Branch types

| Type | Pattern | Branch from | Pull request target | Purpose |
| --- | --- | --- | --- | --- |
| Feature | `feature/short-slug-123` | `develop` | `develop` | New features and enhancements |
| Bugfix | `bugfix/short-slug-123` | `develop` | `develop` | Non-critical bug fixes |
| Hotfix | `hotfix/short-slug-123` | `main` | `main` | Critical production fixes |
| Release | `release/v1.2.0-123` | `develop` | `main` | Release preparation |

Use lowercase kebab-case and include the GitHub issue ID in every branch name.
Do not include the `#` character in branch names. Use `#123` only in commit
messages, pull request descriptions, and issue references.

## Standard task workflow

1. Create or identify the GitHub issue.
2. Update the local integration branch and create a task branch:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/short-slug-123
   ```

3. Implement and test the change.
4. Commit with the issue reference:

   ```bash
   git add <changed-files>
   git commit -m "#123: Add deployment preview"
   ```

   Stage only files related to the issue. Do not include unrelated local
   changes, generated state, secrets, or credentials.

5. Push the branch and open a pull request targeting `develop`:

   ```bash
   git push -u origin feature/short-slug-123
   gh pr create --title "Add deployment preview" --base develop
   ```

6. Address review feedback and ensure all checks pass. A human reviewer owns
   approval and merge decisions.

Normal feature and bugfix pull requests are squash-merged unless a maintainer
documents a reason to preserve individual commits. Task-level commits should
still be kept focused because they support review before the squash merge.

For a feature spanning multiple tasks, use one issue, one branch, multiple
task-level commits, and one pull request.

## Language and documentation format

All repository content must be written in English, even when the original
request, discussion, or planning context is in another language.

This includes code comments, identifiers, commit messages, pull request titles,
pull request descriptions, issue comments, release notes, changelog entries,
user-facing copy, and documentation.

Documentation files must use Markdown unless a different file format is
explicitly required for a specific artifact.

## Commit messages

Use an imperative subject, start with the issue ID, and keep it concise:

```text
#123: Add deployment preview
```

Explain why the change was made in the body when the reason is not obvious.
Do not add agent-authored `Signed-off-by` or `Co-authored-by` trailers.

## Release workflow

1. Create `release/vMAJOR.MINOR.PATCH-123` from `develop`, for example
   `release/v1.2.0-123`.
2. Update the version and release notes.
3. Open a pull request targeting `main`.
4. After approval, squash-merge the release pull request.
5. Tag the release commit on `main` with `vMAJOR.MINOR.PATCH`.
6. Back-merge `main` into `develop`.
7. Delete the release branch after the release is complete.

Use semantic versioning: bug fixes increment PATCH, compatible features
increment MINOR, and breaking changes increment MAJOR.

## Hotfix workflow

1. Create `hotfix/short-slug-123` from `main`.
2. Implement the smallest safe production fix.
3. Open a pull request targeting `main`.
4. After approval, merge the hotfix into `main`.
5. Tag a patch release when appropriate.
6. Back-merge `main` into `develop`, or cherry-pick the hotfix if a direct
   back-merge is not safe.
7. Delete the hotfix branch after the fix is reflected in both `main` and
   `develop`.

## Pull requests and quality

- Keep changes focused and explain the motivation, scope, and validation.
- Add or update tests for every feature and bug fix.
- Verify formatting, static analysis, tests, and the relevant build before
  requesting review.
- Do not include secrets, API keys, credentials, generated local state, or
  unrelated changes.
- Preserve the V1 product requirements in `PRODUCT_REQUIREMENTS.md`, accepted
  decisions in `DECISIONS.md`, and agent constraints in `AGENTS.md`.

## Responsibility

Agents may inspect, implement, test, and prepare a pull request. Human
contributors retain responsibility for review, approval, merge, release, and
production decisions.
