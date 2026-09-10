# Contributing to Codomain

This document contains the Git Flow, issue, pull request, release, and quality
rules for Codomain. Read it before starting work.

## Git Flow

Never commit directly to `main` or `develop`. Use an issue-specific branch and
a human-reviewed pull request.

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

1. Identify the issue and create its branch from the appropriate base.
2. Implement and run [required checks](CODING_STANDARDS.md#validation).
3. Stage only issue-related files; commit using the format below when authorized.
4. Push and open one PR with scope, motivation, and validation evidence.
5. Address feedback; humans approve and merge.

Use one issue, one branch, and one PR per multi-task feature, with focused
task-level commits. Feature and bugfix PRs are normally squash-merged; a
maintainer may document a reason to retain individual commits.

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

## Responsibility

Agents may inspect, implement, test, and prepare a pull request. Human
contributors retain responsibility for review, approval, merge, release, and
production decisions.
