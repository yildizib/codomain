## Purpose

Define the MCP-only site-operation boundary while retaining Dashboard account management and artifact-bound approval.

## ADDED Requirements

### Requirement: Separate account administration from site operations
The system SHALL expose deployment, preview creation/renewal, approval, publication, rollback and version management through authenticated MCP; Dashboard SHALL only provide account and access management.

#### Scenario: Site operation entry point
- **WHEN** an account requests publication or rollback
- **THEN** the request enters through MCP and the worker executes it, with no Dashboard site-action endpoint

#### Scenario: Invalid credential or foreign target
- **WHEN** an MCP request uses a revoked key or targets another account's artifact
- **THEN** it is rejected without creating an actionable site command or exposing cross-account metadata

### Requirement: Preserve exact artifact approval and publication history
The system SHALL bind approval to a sealed digest, create an immutable version from that approval and record each publication or rollback separately. Human-confirmation proof through MCP SHALL be resolved before implementing publication; API key authentication alone SHALL NOT be treated as proof of human review.

#### Scenario: Changed content
- **WHEN** publication targets content different from the approved digest
- **THEN** the operation is rejected and the previous live version is retained

#### Scenario: Rollback
- **WHEN** an authorized rollback selects an existing immutable version
- **THEN** a publication record is created without rewriting content or creating a new version
