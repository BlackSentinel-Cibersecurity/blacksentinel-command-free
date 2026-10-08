# BlackSentinel Command — Free / Open-Source Edition

> **This is the free, limited edition.** `/ai`, `/automation`,
> `/marketplace`, and `/analytics` are **not included in this
> repository's source at all** (not just gated behind a flag) — see
> blacksentinel.tech for the full platform.
>
> Note found while preparing this split: this monorepo has a number of
> pre-existing issues unrelated to the split itself — a nonexistent
> `@radix-ui/react-badge` dependency that blocked `npm install` entirely
> (fixed here and in the paid repo), a malformed root `tsconfig.json`
> (`"extends": "next"`), and multiple type errors in files this split
> never touched (`packages/types/*`, `packages/graph-engine`, some
> `apps/web` pages). Worth a dedicated pass — this PR/commit doesn't fix
> those.

## The Operating System for Enterprise Cybersecurity

BlackSentinel Command is the unified cybersecurity command center that controls your entire security ecosystem. It's not a dashboard, not a portal, not an admin console — it's the **Cybersecurity Operating System** from which your organization manages everything.

---

## Architecture

### Monorepo Structure

```
blacksentinel-command/
├── apps/
│   ├── web/                    # Next.js 14 Frontend Application
│   └── api/                    # Backend API Services
├── packages/
│   ├── ds/                     # Design System
│   │   ├── tokens/             # Design tokens (colors, spacing, typography)
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Shared utilities
│   ├── graph-engine/           # Graph visualization engine
│   └── ai-engine/              # AI/ML engine for security intelligence
├── turbo.json                  # Turborepo configuration
├── tsconfig.json               # Root TypeScript configuration
└── package.json                # Root package.json
```

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Black Primary | `#0B0B0B` | Main background |
| Black Secondary | `#141414` | Secondary background |
| Gray Dark | `#232323` | Borders, dividers |
| Gray Medium | `#3C3C3C` | Muted text, icons |
| Gray Light | `#D9D9D9` | Secondary text |
| White | `#FFFFFF` | Primary text |
| Orange Primary | `#FF6B00` | Brand accent, CTAs |
| Orange Bright | `#FF8C1A` | Hover states |
| Critical Red | `#EF4444` | Errors, critical alerts |
| Success Green | `#22C55E` | Success states |
| Info Blue | `#3B82F6` | Informational |
| Warning Yellow | `#FACC15` | Warnings |

### Components

The design system includes:

- **Button** - Primary, secondary, ghost, glow variants
- **Card** - Default, elevated, glass, glow, interactive variants
- **Input** - Text input with icons and validation
- **Badge** - Status indicators with dot option
- **MetricCard** - KPI display with trends
- **StatusIndicator** - Dot, badge, pulse variants
- **AlertBanner** - Info, success, warning, critical alerts

---

## Core Modules

### 1. Executive Command Center
**Path:** `/dashboard`

Executive-level security overview with:
- Global Security Score
- Business Risk Score
- Attack Surface metrics
- Threat Activity timeline
- Identity Risk monitoring
- AI Recommendations

### 2. SOC Command Center
**Path:** `/operations/soc`

Security Operations Center with:
- Real-time alert monitoring
- Incident management
- MITRE ATT&CK integration
- Playbook execution
- Investigation tracking
- Analyst workload management

### 3. Infrastructure Command
**Path:** `/infrastructure`

Complete infrastructure visibility:
- Cloud resources (AWS, Azure, GCP)
- Container orchestration (Kubernetes)
- Network devices
- Databases
- Endpoints
- IoT/OT devices

### 4. Global Asset Graph
**Path:** `/assets`

Interactive visualization of:
- Users and identities
- Servers and containers
- Cloud resources
- Network devices
- Vulnerabilities
- Alerts and incidents
- All relationships between entities

### 5. Digital Twin
**Path:** `/infrastructure/digital-twin`

Real-time digital representation:
- Infrastructure topology
- Dependency mapping
- Risk visualization
- Event correlation
- Change tracking

### 6. AI Command Center
**Path:** `/ai`

Unified AI copilot:
- Natural language queries
- Security analysis
- Report generation
- Automated actions
- Trend predictions
- Context-aware responses

### 7. Investigations
**Path:** `/investigations`

Investigation workspace:
- Timeline reconstruction
- Evidence management
- IOC tracking
- Asset correlation
- Team collaboration
- MITRE mapping

### 8. Automation Center
**Path:** `/automation`

Security orchestration:
- Playbook management
- Automated response
- Workflow templates
- Execution history
- Performance metrics

### 9. Compliance Center
**Path:** `/compliance`

Regulatory compliance:
- SOC 2 tracking
- ISO 27001 compliance
- GDPR monitoring
- HIPAA adherence
- Audit management

### 10. Analytics
**Path:** `/analytics`

Security analytics:
- Trend visualization
- Performance metrics
- Report generation
- Scheduled reporting
- Custom dashboards

### 11. Administration
**Path:** `/administration`

Platform management:
- User management
- Role-based access
- API key management
- Integration configuration
- Security settings
- Appearance customization

### 12. Marketplace
**Path:** `/marketplace`

Extension ecosystem:
- Connectors
- Dashboards
- Playbooks
- Widgets
- Modules
- Integrations

---

## Key Features

### Unified Experience
- Single platform for all security operations
- No application switching
- Consistent UI/UX across all modules
- Context-aware navigation

### Customizable Dashboards
- Drag-and-drop widget system
- Save and share layouts
- Role-based views
- Real-time data refresh

### AI-Powered Intelligence
- Natural language queries
- Automated analysis
- Predictive insights
- Context-aware recommendations

### Real-time Monitoring
- Live data streams
- Instant alerts
- Auto-refreshing dashboards
- WebSocket connections

### Enterprise Security
- Zero Trust architecture
- MFA/SSO support
- RBAC/ABAC permissions
- Audit logging
- Session recording

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/BlackSentinel-Cibersecurity/blacksentinel-command-free.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --workspace=@blacksentinel/command-web

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type check
npm run typecheck
```

---

## Technology Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Flow** - Graph visualization
- **Recharts** - Charts and graphs
- **Zustand** - State management
- **React Query** - Data fetching

### Backend (Planned)
- **Node.js** - Runtime
- **Fastify** - HTTP framework
- **PostgreSQL** - Primary database
- **Redis** - Caching
- **Neo4j** - Graph database
- **Elasticsearch** - Search engine
- **Kafka** - Event streaming
- **OpenAI** - AI capabilities

### Infrastructure
- **Kubernetes** - Container orchestration
- **Docker** - Containerization
- **Terraform** - Infrastructure as code
- **GitHub Actions** - CI/CD
- **Prometheus** - Metrics
- **Grafana** - Monitoring

---

## Design Principles

1. **Command Center Feel** - Space mission control aesthetic
2. **Information Density** - Bloomberg Terminal inspired
3. **Minimalist Design** - Apple-like simplicity
4. **Fluid Interactions** - Linear-like smoothness
5. **Context Over Data** - Show understanding, not just metrics
6. **Unified Experience** - One platform, one ecosystem

---

## Performance Targets

- **Initial Load:** < 2 seconds
- **Navigation:** < 200ms
- **Data Refresh:** < 1 second
- **Animation Duration:** 200ms
- **API Response:** < 500ms
- **Lighthouse Score:** > 90

---

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support

---

## Deployment Options

### Universal Deployment Support

BlackSentinel Command supports deployment across all major platforms:

| Platform | Command | Documentation |
|----------|---------|---------------|
| Docker Local | `./scripts/deploy.sh docker` | [Docker Guide](docs/DEPLOYMENT-GUIDE.md#docker-deployment) |
| Kubernetes | `./scripts/deploy.sh kubernetes` | [K8s Guide](docs/DEPLOYMENT-GUIDE.md#kubernetes-deployment) |
| AWS EKS | `./scripts/deploy.sh aws` | [AWS Guide](docs/DEPLOYMENT-GUIDE.md#aws-deployment) |
| Azure AKS | `./scripts/deploy.sh azure` | [Azure Guide](docs/DEPLOYMENT-GUIDE.md#azure-deployment) |
| GCP GKE | `./scripts/deploy.sh gcp` | [GCP Guide](docs/DEPLOYMENT-GUIDE.md#gcp-deployment) |
| On-Premise | `./scripts/deploy.sh on-premise` | [On-Premise Guide](docs/DEPLOYMENT-GUIDE.md#on-premise-deployment) |
| Air-Gapped | Manual deployment | [Air-Gapped Guide](docs/DEPLOYMENT-GUIDE.md#air-gapped-deployment) |

### Quick Start

```bash
# Local development
docker-compose up -d

# Production deployment
./scripts/deploy.sh docker --tier enterprise --env production

# Cloud deployment
./scripts/deploy.sh aws --tier enterprise --region us-east-1
```

---

## Roadmap

### Phase 1 (Current - v1.0)
- [x] Core layout and navigation
- [x] Design system
- [x] Executive dashboard
- [x] SOC command center
- [x] Infrastructure command
- [x] Global asset graph
- [x] AI command center
- [x] Investigations
- [x] Automation center
- [x] Compliance center
- [x] Analytics
- [x] Administration
- [x] Marketplace
- [x] Multi-tenant support
- [x] Licensing system
- [x] Universal deployment

### Phase 2 (v1.1 - Q3 2026)
- [ ] Backend API services
- [ ] Real-time data integration
- [ ] User authentication
- [ ] WebSocket connections
- [ ] Database integration
- [ ] Mobile application

### Phase 3 (v2.0 - Q4 2026)
- [ ] Advanced AI features
- [ ] Custom report builder
- [ ] API marketplace
- [ ] White-label solution
- [ ] Multi-language support

---

## Before you run it

- This is a **technical preview** and the open-source edition of the product. It comes with no warranty and no service-level commitment: try it in a test environment first.
- It is **self-hosted**. BlackSentinel does not host it for you, and paid plans are not on sale.
- Change every default credential and secret before exposing anything to a network. Never deploy with the example values from `.env.example` or `.env.production`.
- Use it only on systems you own or are explicitly authorized to test or monitor. See the [Acceptable Use Policy](https://blacksentinel.tech/acceptable-use/).

## Support

- Bugs and questions: [open an issue](https://github.com/BlackSentinel-Cibersecurity/blacksentinel-command-free/issues) in this repository.
- Security reports: follow [security.txt](https://blacksentinel.tech/.well-known/security.txt). Please do not open a public issue for a vulnerability.
- Everything else: BlackSentinel-tech@protonmail.com

## License

MIT. See [LICENSE](LICENSE). The BlackSentinel name and logo are not covered by the licence.
