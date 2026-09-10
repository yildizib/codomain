## Purpose

Accept large static-site submissions safely and preserve exact previewed content as permanent versions with isolated file delivery.

## ADDED Requirements

### Requirement: Quarantine and validate uploaded content
MCP Server SHALL own controlled large-file upload sessions and transfer endpoints. Finalized content SHALL be frozen, validated, scanned in isolation and sealed before preview. Queue messages SHALL contain references rather than uploaded file bytes.

#### Scenario: Incomplete scan
- **WHEN** scanning times out, exceeds a limit or cannot inspect content
- **THEN** no preview or version is created and the job records a rejection or controlled retry outcome

#### Scenario: Unsafe input
- **WHEN** paths escape the site namespace or content is infected
- **THEN** validation fails without exposing content through Nginx

### Requirement: Preserve sealed versions and restrict delivery
The system SHALL keep metadata in PostgreSQL and file artifacts on private NFS, serving only permitted sealed content through read-only Nginx on a separate VPS. Preview access SHALL remain expiring, revocable and isolated from Dashboard. Versions SHALL retain the approved digest and SHALL NOT be automatically deleted.

#### Scenario: Unauthorized artifact URL
- **WHEN** a direct request targets an artifact without a live-route or valid preview authorization, or uses an expired/revoked preview
- **THEN** delivery is denied regardless of the existence of its NFS directory

#### Scenario: Temporary cleanup
- **WHEN** cleanup applies the last-10 temporary-content policy
- **THEN** active work and every version-referenced artifact are protected and deployment metadata is retained

#### Scenario: Publication failure
- **WHEN** artifact preparation or publication fails
- **THEN** the previously published version remains selected and existing immutable contents are unchanged
