# Codomain

> Your AI assistant builds the website. Our publishing platform puts it live.

Codomain helps you publish a static website built by your own AI assistant.
Bring your HTML, CSS, JavaScript, and assets, review a preview, and approve
the site when it is ready. No hosting or deployment knowledge is required.

## How it works

```mermaid
flowchart TB
  subgraph create["1 · Create with your AI"]
    A["Connect your AI using dashboard instructions"] --> B["Ask your AI to build and submit the site"]
  end
  subgraph review["2 · Review in Codomain"]
    B --> C["Open the preview"] --> D["Approve the site"]
  end
  subgraph publish["3 · Share"]
    D --> E["Your site is live at its URL"]
  end
  classDef actor fill:#dbeafe,stroke:#2563eb,color:#172554;
  classDef reviewStep fill:#fef3c7,stroke:#d97706,color:#451a03;
  classDef live fill:#dcfce7,stroke:#16a34a,color:#14532d;
  class A,B actor;
  class C,D reviewStep;
  class E live;
```

Your AI connects through MCP, the integration used to send files to Codomain.
Asking it to publish prepares a preview; you approve publication in Codomain.

## What you get in V1

- One site and one free subdomain per account.
- A dashboard with AI connection instructions and API key management.
- Preview and live URLs, deployment history, and saved versions.
- Previous-version previews and rollback to restore your site.

Codomain serves static websites. You bring the AI assistant; visual editing,
server-side application hosting, multiple sites, teams, and custom domains
are outside V1.

## Project status

Product definition and architecture baseline. Application setup and deployment
instructions will follow once the implementation stack is selected.

## Documentation

| Read about | Document |
| --- | --- |
| V1 scope and acceptance | [Product requirements](PRODUCT_REQUIREMENTS.md) |
| Components, terminology, lifecycle | [Architecture](ARCHITECTURE.md) |
| AI integration contracts | [MCP design](MCP_DESIGN.md) |
| Security and reporting | [Security](SECURITY.md) |
| Decision history | [Decisions](DECISIONS.md) |
| Development rules | [Coding standards](CODING_STANDARDS.md) |
| Contribution workflow | [Contributing](CONTRIBUTING.md) |
| Agent instructions | [AGENTS](AGENTS.md) |
