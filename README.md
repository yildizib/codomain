# Codomain

## Your AI assistant builds the website. Our publishing platform puts it live.

Codomain is a remote MCP publishing platform for static websites. Users bring
their own AI assistant or agent—such as ChatGPT, Claude, Gemini, Codex, or
another MCP-compatible client—to create a website. Codomain receives the
generated project, provides a preview, manages versions, and publishes the
approved site to a live URL.

Codomain does not provide an AI assistant. It is the publishing layer between a
user's AI agent and the web.

## What Codomain is

- A remote MCP publishing platform for AI-generated static websites
- A preview and approval workflow for generated HTML, CSS, JavaScript, and assets
- A versioned deployment system with deployment history and rollback
- A simple, account-based publishing experience with a free subdomain

## What Codomain is not

- An AI chatbot or AI model provider
- A visual website builder such as Wix
- A general-purpose deployment platform such as Vercel or Netlify
- A traditional hosting control panel

## V1 scope

V1 follows a deliberately focused ownership model:

```text
One account = one site = one MCP connection
```

Each user can:

- Create an account with email, first name, last name, and password
- Accept the Terms and Conditions during registration
- Receive one free subdomain, for example `project-name.yourbrand.com`
- Manage one site associated with that account
- Download a generated `CODOMAIN_MCP_README.md` containing project context and
  MCP usage instructions
- View MCP connection details in the dashboard
- Create, revoke, and rotate an API key
- Change their account password
- Send site files from their AI agent through MCP
- Review a generated preview URL
- Approve a preview for publication
- View the published URL
- Browse deployment and version history
- Preview a previous version and roll back to it

When API key state changes, the generated integration README and MCP connection
template update automatically. Raw API keys are shown only at creation or
rotation time and are never embedded in generated documentation. The user must
place the newly issued key in their AI client's secret configuration.

## Publishing workflow

Each accepted submission creates a deployment. After validation, Codomain seals
the deployment artifact and creates a preview. User approval promotes that exact
artifact to an immutable version, and publication records a separate event:

```text
AI agent builds files
        ↓
MCP sends the static site to Codomain
        ↓
Codomain creates and validates a deployment
        ↓
Codomain seals the artifact and creates a preview URL
        ↓
User reviews and approves the preview
        ↓
Codomain creates a new version
        ↓
Codomain records a publication and atomically updates the live pointer
```

Previous versions remain available for inspection. A user can ask their AI
agent to create a time-limited preview for a selected version. Rollback records
a new publication event and points the live site to an existing immutable
version; it does not create or rewrite a version.

## Dashboard

The dashboard is the control center for the user's single site. It exposes:

- Site information and subdomain
- MCP connection details
- Generated `CODOMAIN_MCP_README.md` download
- API key lifecycle management
- Preview and published URLs
- Deployment history
- Version history
- Version preview and rollback
- Account password management

## Security principles

- API keys are scoped to the owning account and site.
- Revoked or rotated keys must stop authorizing MCP requests.
- Site files must be isolated between accounts.
- Publishing requires explicit user approval of the preview.
- Credentials must never be committed to the repository, exposed in logs, or
  embedded in generated README content.

## Future direction

The V1 account model is intentionally designed to support future professional
and agency features without changing the core publishing workflow:

- Multiple sites per account
- Multiple subdomains
- Custom domains
- Project-specific MCP connections
- Client-level access and team members
- Approval workflows
- White-label publishing

These capabilities are future scope and should not be introduced into V1
without an explicit product decision.

## Development status

Codomain is currently in the product definition and architecture phase. The
repository uses OpenSpec for planning and change management. Implementation
details, local setup instructions, and deployment commands will be added as
the application stack is established.

## Documentation map

- [`PRODUCT_REQUIREMENTS.md`](PRODUCT_REQUIREMENTS.md): normative V1 product
  scope and acceptance criteria
- [`DECISIONS.md`](DECISIONS.md): accepted architecture decisions and their
  tradeoffs
- [`ARCHITECTURE.md`](ARCHITECTURE.md): logical components, boundaries, and data
  flow
- [`MCP_DESIGN.md`](MCP_DESIGN.md): MCP capabilities and contract expectations
- [`SECURITY.md`](SECURITY.md): security requirements and vulnerability reporting
- [`CODING_STANDARDS.md`](CODING_STANDARDS.md): implementation quality standards
- [`CONTRIBUTING.md`](CONTRIBUTING.md): contribution and Git workflow
- [`AGENTS.md`](AGENTS.md): repository instructions for coding agents

This README is a public summary. When wording conflicts, the specialized
document for that subject is authoritative.

## Product terminology

- **Account**: A registered Codomain user.
- **Site**: The single static website owned by a V1 account.
- **MCP connection**: The account-scoped logical configuration used by an AI
  client to interact with Codomain.
- **Preview**: A non-live rendering of a sealed deployment artifact or an
  existing immutable version.
- **Deployment**: A submission of site files and its resulting operational
  record.
- **Version**: An immutable, content-identified state of the site created from
  an approved sealed deployment.
- **Publication**: An auditable event that points the live site to an immutable
  version, including rollback publications.
- **Published version**: The version currently served at the live URL.
