## Purpose

Ensure accepted cross-application operations survive service and broker restarts
and can be retried without losing intent or duplicating business effects.

## ADDED Requirements

### Requirement: Transactional outbox before broker delivery
Every cross-application event SHALL be inserted into the producing application's
insert-only outbox in the same database transaction as the business intent that
caused it. Producers SHALL send only committed outbox events to MQ and SHALL
retain the same event identity and payload across delivery retries.

#### Scenario: Business transaction rolls back
- **WHEN** a transaction containing business intent and an outbox insert rolls back
- **THEN** neither the business intent nor a deliverable event exists

#### Scenario: Producer stops after commit and before send
- **WHEN** business intent and its outbox event commit but the producer stops before MQ accepts the event
- **THEN** producer recovery sends the committed event after restart

#### Scenario: Broker accepts event before confirmation is recorded
- **WHEN** MQ accepts an event but the producer stops before recording confirmation
- **THEN** retry sends the same event ID and payload and does not create a new event

### Requirement: Persistent single-node broker delivery
V1 SHALL use a standalone single-node MQ with persistent journal storage and
durable queues/messages. Consumers SHALL acknowledge delivery only after durable
inbox/job acceptance. Broker HA SHALL NOT be represented as a V1 guarantee.

#### Scenario: Broker restarts after accepting a durable event
- **WHEN** the broker restarts after durably accepting an event that has not been acknowledged by its consumer
- **THEN** the event remains available for redelivery

#### Scenario: Consumer stops before acknowledgement
- **WHEN** a consumer receives an event and stops before its durable acceptance and acknowledgement complete
- **THEN** MQ redelivers the event and the consumer handles it safely

#### Scenario: Broker is unavailable
- **WHEN** a producer cannot reach MQ
- **THEN** the committed outbox event remains pending and is retried without losing accepted business intent

### Requirement: Durable inbox deduplication
Every consumer SHALL persist the globally unique event ID in a durable inbox
before acknowledging MQ delivery. The inbox SHALL enforce uniqueness on event ID,
and duplicate delivery SHALL return the original acceptance state without
duplicating the job or business effect.

#### Scenario: Same event is delivered more than once
- **WHEN** a consumer receives an event ID already present in its inbox
- **THEN** it does not create another durable job or repeat the event's business effect

#### Scenario: Different events belong to one operation
- **WHEN** multiple event IDs carry the same operation ID
- **THEN** each event is deduplicated independently while remaining correlated to the same operation

### Requirement: Separate request and event identities
The system SHALL use a global `operationId` to identify and correlate a business
operation, a global `eventId` to identify one outbox/MQ event, and an optional
`causationEventId` to identify the event that caused another event. Account-scoped
request idempotency SHALL remain separate from event delivery identity.

#### Scenario: Identical request is retried
- **WHEN** an account repeats the same operation type and idempotency key with the same normalized request fingerprint
- **THEN** the original operation ID is returned and no additional actionable outbox event is created

#### Scenario: Idempotency key is reused for different input
- **WHEN** an account repeats the same operation type and idempotency key with a different normalized request fingerprint
- **THEN** the request is rejected as a conflict

#### Scenario: Operation emits a follow-up event
- **WHEN** processing one event produces another event for the same operation
- **THEN** the follow-up receives a new event ID, retains the operation ID, and records the source event as its causation event ID

### Requirement: Messaging records preserve safe source identity
Each message SHALL include bounded schema-versioned metadata containing event,
operation, source application, actor/caller, correlation, causation, and payload
reference fields required by the operation. MQ messages SHALL NOT contain uploaded
file bytes, raw credentials, preview capabilities, or unsafe error payloads.

#### Scenario: Message exceeds its metadata boundary
- **WHEN** a producer attempts to publish uploaded bytes, raw credentials, or an oversized payload in an event
- **THEN** message validation rejects publication and the safe failure remains attributable to the pending outbox event
