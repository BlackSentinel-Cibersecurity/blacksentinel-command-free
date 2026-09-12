# BlackSentinel Command — Free / Open-Source Edition

> **This is the free, limited edition.** `/ai`, `/automation`,
> `/marketplace`, and `/analytics` are **not included in this
> repository's source at all** (not just gated behind a flag) — see
> blacksentinel.io for the full platform.
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
git clone https://github.com/your-org/blacksentinel-command.git

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

## Pricing & Licensing

### Pricing Tiers

| Tier | Base Price | Per User | Max Users | Use Case |
|------|------------|----------|-----------|----------|
| **Starter** | $499/mo | $49/user | 10 | Small security teams |
| **Professional** | $1,999/mo | $39/user | 50 | Growing organizations |
| **Enterprise** | $9,999/mo | $29/user | 500 | Large enterprises |
| **Government** | $49,999/mo | $99/user | 10,000 | Government & defense |

### Pricing Calculator Examples

| Scenario | Users | Assets | Monthly Cost |
|----------|-------|--------|--------------|
| Small Business | 5 | 500 | $574 |
| Mid-Market | 30 | 3,000 | $3,439 |
| Enterprise | 200 | 20,000 | $16,999 |
| Government | 1,000 | 100,000 | $169,999 |

### Licensing Options

1. **Subscription License** - Monthly/Annual billing (Most Popular)
2. **Perpetual License** - One-time purchase + maintenance
3. **Trial License** - 30-day free trial
4. **NFR License** - For partners and resellers
5. **OEM License** - White-label for integrators

### Volume Discounts

| Commitment | Discount |
|------------|----------|
| 1 year | 10% |
| 2 years | 15% |
| 3 years | 20% |

---

## Delivery Models for Organizations

### Option 1: SaaS (Software as a Service)

**Best for:** Organizations wanting minimal infrastructure management

- Hosted by BlackSentinel
- 99.99% uptime SLA
- Automatic updates
- 24/7 support
- **Pricing:** Subscription per user/asset

### Option 2: Managed Service

**Best for:** Organizations wanting control without infrastructure burden

- Deployed in customer's cloud
- BlackSentinel manages operations
- Custom configurations
- Dedicated support
- **Pricing:** Management fee + usage

### Option 3: Self-Hosted

**Best for:** Organizations requiring full control

- Deployed on customer's infrastructure
- Customer manages operations
- Full customization
- Training and documentation
- **Pricing:** License + support contract

### Option 4: Air-Gapped

**Best for:** Government and defense organizations

- No internet connection required
- Manual updates via secure media
- Complete isolation
- On-site support
- **Pricing:** Premium license + on-site support

---

## Implementation Services

### Standard Implementation
- Duration: 2-4 weeks
- Includes: Installation, configuration, training
- **Price:** $25,000

### Enterprise Implementation
- Duration: 4-8 weeks
- Includes: Custom integration, custom dashboards, advanced training
- **Price:** $75,000

### Government Implementation
- Duration: 8-12 weeks
- Includes: Compliance setup, security hardening, on-site training
- **Price:** $150,000

---

## Support Plans

### Basic Support
- Email support (24h response)
- Documentation access
- Community forum
- **Included:** All tiers

### Standard Support
- Chat + Email (4h response)
- Phone support (business hours)
- Priority bug fixes
- **Included:** Professional tier

### Premium Support
- 24/7 phone support (1h response)
- Dedicated account manager
- Custom development
- **Included:** Enterprise tier

### Enterprise Support
- 24/7 phone support (15min response)
- Dedicated support team
- On-site support
- Custom SLA
- **Included:** Government tier

---

## Partner Programs

### Reseller Program
- Earn 20-30% margin
- Sales enablement
- Marketing support
- **Requirements:** $100K annual commitment

### Technology Partners
- Integration marketplace
- Co-marketing
- Technical support
- **Requirements:** Certified integration

### Consulting Partners
- Implementation services
- Training certification
- Lead referral
- **Requirements:** Certified consultants

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

## License

Proprietary - BlackSentinel Security Inc.

See [LICENSE.md](LICENSE.md) for details.

---

## Support

- **Documentation:** https://docs.blacksentinel.io
- **Email:** support@blacksentinel.io
- **Phone:** +1-800-BLACK-911
- **Slack:** #command-support
- **Emergency:** +1-800-BLACK-911

---

## Sales

- **Email:** sales@blacksentinel.io
- **Phone:** +57-315-BLACK-SALES
- **Web:** https://blacksentinel.io/contact
- **Free Trial:** https://blacksentinel.io/trial
