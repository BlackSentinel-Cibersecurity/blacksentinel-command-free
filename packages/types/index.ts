// BlackSentinel Command - Core Types

// ============================================================================
// Core Entity Types
// ============================================================================

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type Status = 'active' | 'investigating' | 'contained' | 'resolved' | 'closed' | 'pending';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

// ============================================================================
// Asset Types
// ============================================================================

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  risk: RiskLevel;
  owner?: string;
  department?: string;
  location?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetType =
  | 'server'
  | 'workstation'
  | 'laptop'
  | 'mobile'
  | 'container'
  | 'virtual-machine'
  | 'database'
  | 'network-device'
  | 'firewall'
  | 'router'
  | 'switch'
  | 'iot-device'
  | 'cloud-resource'
  | 'saas-application'
  | 'domain'
  | 'ip-address'
  | 'certificate'
  | 'secret';

export type AssetStatus = 'online' | 'offline' | 'maintenance' | 'decommissioned';

// ============================================================================
// Identity Types
// ============================================================================

export interface Identity {
  id: string;
  username: string;
  email: string;
  displayName: string;
  type: IdentityType;
  status: IdentityStatus;
  risk: RiskLevel;
  roles: string[];
  permissions: string[];
  lastActivity: Date;
  mfaEnabled: boolean;
  metadata: Record<string, unknown>;
}

export type IdentityType = 'human' | 'service' | 'machine' | 'api-key';
export type IdentityStatus = 'active' | 'inactive' | 'locked' | 'disabled';

// ============================================================================
// Threat Types
// ============================================================================

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  origin: string;
  motivation: string;
  targets: string[];
  techniques: string[];
  confidence: ThreatConfidence;
  activity: ThreatActivity;
  firstSeen: Date;
  lastSeen: Date;
  description: string;
  metadata: Record<string, unknown>;
}

export type ThreatConfidence = 'confirmed' | 'probable' | 'possible' | 'unknown';
export type ThreatActivity = 'active' | 'inactive' | 'unknown';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  severity: Severity;
  threatActors: string[];
  targets: string[];
  techniques: string[];
  iocs: IOC[];
  description: string;
  firstSeen: Date;
  lastSeen: Date;
  metadata: Record<string, unknown>;
}

export type CampaignStatus = 'active' | 'monitoring' | 'contained' | 'resolved';

export interface IOC {
  id: string;
  type: IOCType;
  value: string;
  severity: Severity;
  confidence: ThreatConfidence;
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
  sources: string[];
  metadata: Record<string, unknown>;
}

export type IOCType = 'ip-address' | 'domain' | 'url' | 'file-hash' | 'email' | 'mutex' | 'registry-key';

// ============================================================================
// Alert & Incident Types
// ============================================================================

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  source: string;
  assignee?: string;
  affectedAssets: string[];
  affectedIdentities: string[];
  mitreTactic?: string;
  mitreTechnique?: string;
  iocs: IOC[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export type AlertStatus = 'new' | 'investigating' | 'contained' | 'resolved' | 'closed' | 'false-positive';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  priority: number;
  assignee: string;
  team: string;
  alerts: string[];
  affectedAssets: string[];
  affectedIdentities: string[];
  timeline: TimelineEvent[];
  evidence: Evidence[];
  playbooks: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  metadata: Record<string, unknown>;
}

export type IncidentStatus = 'open' | 'investigating' | 'containment' | 'eradication' | 'recovery' | 'closed';

// ============================================================================
// Investigation Types
// ============================================================================

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  lead: string;
  team: string[];
  relatedIncidents: string[];
  relatedAlerts: string[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  metadata: Record<string, unknown>;
}

export type InvestigationStatus = 'open' | 'active' | 'pending' | 'closed';

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  content: string;
  tags: string[];
  collectedBy: string;
  collectedAt: Date;
  metadata: Record<string, unknown>;
}

export type EvidenceType = 'log' | 'screenshot' | 'pcap' | 'file' | 'memory-dump' | 'disk-image' | 'network-capture';

// ============================================================================
// Automation Types
// ============================================================================

export interface Playbook {
  id: string;
  name: string;
  description: string;
  status: PlaybookStatus;
  trigger: PlaybookTrigger;
  steps: PlaybookStep[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
  metadata: Record<string, unknown>;
}

export type PlaybookStatus = 'draft' | 'active' | 'paused' | 'disabled';
export type PlaybookTrigger = 'manual' | 'alert' | 'schedule' | 'event' | 'api';

export interface PlaybookStep {
  id: string;
  name: string;
  type: StepType;
  action: string;
  parameters: Record<string, unknown>;
  condition?: string;
  timeout?: number;
  retryCount?: number;
}

export type StepType = 'action' | 'condition' | 'loop' | 'parallel' | 'notification' | 'approval';

// ============================================================================
// Compliance Types
// ============================================================================

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  status: ComplianceStatus;
  score: number;
  requirements: ComplianceRequirement[];
  lastAssessment: Date;
  nextAssessment: Date;
  metadata: Record<string, unknown>;
}

export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: ComplianceStatus;
  controls: string[];
  evidence: string[];
  lastAssessed: Date;
  metadata: Record<string, unknown>;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  widgets: Widget[];
  owner: string;
  shared: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gaps: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  config: Record<string, unknown>;
  refreshInterval?: number;
}

export type WidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'list'
  | 'graph'
  | 'map'
  | 'timeline'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'matrix';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

// ============================================================================
// User & Organization Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  preferences: UserPreferences;
  lastLogin: Date;
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export type UserRole = 'admin' | 'analyst' | 'viewer' | 'executive' | 'api';

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboard?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  slack: boolean;
  webhook?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  tier: OrganizationTier;
  status: OrganizationStatus;
  settings: OrganizationSettings;
  members: string[];
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export type OrganizationTier = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom';
export type OrganizationStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

export interface OrganizationSettings {
  sso: boolean;
  mfa: boolean;
  auditLog: boolean;
  dataRetention: number;
  apiRateLimit: number;
  maxUsers: number;
  maxAssets: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Graph Types
// ============================================================================

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: Record<string, unknown>;
}

// ============================================================================
// AI Types
// ============================================================================

export interface AIQuery {
  id: string;
  query: string;
  response?: string;
  status: QueryStatus;
  context: QueryContext;
  createdAt: Date;
  completedAt?: Date;
  metadata: Record<string, unknown>;
}

export type QueryStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QueryContext {
  organizationId: string;
  userId: string;
  timestamp: Date;
  filters?: Record<string, unknown>;
}

export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: Severity;
  impact: string;
  effort: string;
  status: RecommendationStatus;
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export type RecommendationType = 'remediation' | 'optimization' | 'prevention' | 'detection' | 'response';
export type RecommendationStatus = 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'dismissed';
