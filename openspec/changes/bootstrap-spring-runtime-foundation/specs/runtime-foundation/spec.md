## Purpose

Provide a reproducible, compatible runtime and persistence baseline on which all
Codomain V1 applications can be implemented and validated consistently.

## ADDED Requirements

### Requirement: Reproducible supported runtime
The system SHALL build and run the Dashboard, MCP Server, and Deployment Worker
on Java 21 using the selected compatible Spring Boot, Spring Framework, Spring AI,
and Gradle release line. Managed dependency versions SHALL remain under their
owning BOM unless a later approved decision records an override.

#### Scenario: Clean build uses the selected toolchain
- **WHEN** a contributor builds a clean checkout with the documented wrapper
- **THEN** every application compiles and tests with Java 21 and the pinned build and platform versions

#### Scenario: Incompatible Java runtime is rejected
- **WHEN** a build runs with a Java runtime outside the documented toolchain
- **THEN** the build fails with an actionable compatibility error rather than producing an unverified artifact

### Requirement: Application-owned database migrations
Each application SHALL apply its schema changes through ordered Liquibase
changesets owned by that application. Runtime roles SHALL NOT require schema
definition privileges, and one application's role SHALL NOT gain access to
another application's domain tables merely because the schemas share a cluster.

#### Scenario: Empty database is initialized
- **WHEN** migrations run against an empty supported PostgreSQL cluster
- **THEN** the required shared identity object and application-owned schemas are created in dependency order

#### Scenario: Runtime role attempts schema modification
- **WHEN** a normal application runtime role attempts to create, alter, or drop schema objects
- **THEN** PostgreSQL rejects the operation

#### Scenario: Application attempts cross-schema domain access
- **WHEN** one application's runtime role attempts to read or mutate another application's domain table
- **THEN** PostgreSQL rejects the operation except for explicitly granted shared foundation objects

### Requirement: Globally unique Long identifiers
The system SHALL generate operation and event identifiers from a shared
PostgreSQL sequence as `BIGINT` values. Sequence values SHALL be treated as
opaque, non-gapless identifiers and SHALL NOT authorize access or establish
business ordering.

#### Scenario: Different applications allocate identifiers
- **WHEN** two applications allocate operation or event identifiers concurrently
- **THEN** every allocated identifier is globally unique across the system

#### Scenario: Transaction rolls back after allocation
- **WHEN** a transaction obtains an identifier and later rolls back
- **THEN** the identifier may remain unused and no component assumes a gap indicates missing business data

### Requirement: Precision-safe external identifier representation
Database identifiers SHALL use PostgreSQL `BIGINT`, Java domain and persistence
interfaces SHALL use `long` or `Long` as appropriate, and MCP/JSON contracts SHALL
serialize identifiers as base-10 strings.

#### Scenario: Identifier exceeds JavaScript safe integer range
- **WHEN** an identifier is greater than JavaScript's maximum safe integer
- **THEN** its MCP/JSON representation preserves the exact decimal value as a string

#### Scenario: Invalid decimal identifier is received
- **WHEN** an external request contains a negative, zero, non-decimal, or out-of-range identifier where a system ID is required
- **THEN** the request is rejected as invalid input without performing a lookup
