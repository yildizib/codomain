## Purpose

Make accepted operations recoverable and traceable across producer, queue and worker restarts without modifying outbox messages.

## ADDED Requirements

### Requirement: Producer-owned immutable message delivery
Each application SHALL atomically persist business intent and an insert-only outbox message, then deliver its own committed messages to MQ. No separate outbox relay SHALL be deployed. Delivery attempts and confirms SHALL be append-only records outside the immutable message.

#### Scenario: Crash before send
- **WHEN** an application commits a message but stops before sending it
- **THEN** that same application recovers the unconfirmed message after restart using its original identity and payload

#### Scenario: Confirm record lost
- **WHEN** the broker accepts a message but its confirmation is not recorded
- **THEN** a repeat delivery uses the same app-name:outboxId and does not create duplicate business effects

#### Scenario: Outbox mutation
- **WHEN** a normal application role attempts to update or delete an outbox message
- **THEN** the database denies the mutation

### Requirement: Durable processing and source traceability
The worker SHALL durably deduplicate receipt and create its job before ACK, track source/operation/correlation identities and processing attempts, and recover interrupted jobs. The worker SHALL persist results with its own insert-only outbox and send results itself.

#### Scenario: Worker stops after acknowledgment
- **WHEN** a worker stops after inbox/job commit and ACK but before completion
- **THEN** durable job recovery resumes idempotent work rather than losing or duplicating the operation

#### Scenario: Processing error
- **WHEN** a job attempt fails
- **THEN** safe error and attempt history remain available with source identity and a retry or terminal outcome, without modifying its source outbox

### Requirement: Distinguish request idempotency from delivery identity
The system SHALL preserve app-name:outboxId on message retries and separately deduplicate repeated account-scoped operation requests.

#### Scenario: Repeated request
- **WHEN** identical intent reuses its request idempotency key
- **THEN** the original operation is returned without another actionable outbox message

#### Scenario: Conflicting request
- **WHEN** different intent reuses a request idempotency key
- **THEN** a safe conflict is returned
