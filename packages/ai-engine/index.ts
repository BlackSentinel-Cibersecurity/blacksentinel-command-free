// BlackSentinel AI Engine
// Unified AI copilot for the entire security ecosystem

// ============================================================================
// Types
// ============================================================================

export interface AIQuery {
  id: string;
  query: string;
  response?: AIResponse;
  status: QueryStatus;
  context: QueryContext;
  metadata: QueryMetadata;
  createdAt: Date;
  completedAt?: Date;
}

export type QueryStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface QueryContext {
  organizationId: string;
  userId: string;
  userRole: UserRole;
  currentModule?: string;
  filters?: Record<string, unknown>;
  timestamp: Date;
}

export type UserRole = 'ciso' | 'soc_analyst' | 'security_engineer' | 'compliance' | 'executive' | 'admin';

export interface QueryMetadata {
  tokens: number;
  processingTime: number;
  model: string;
  confidence: number;
}

export interface AIResponse {
  content: string;
  type: ResponseType;
  data?: ResponseData[];
  visualizations?: Visualization[];
  actions?: RecommendedAction[];
  sources?: DataSource[];
  confidence: number;
}

export type ResponseType = 
  | 'text'
  | 'data'
  | 'visualization'
  | 'action'
  | 'mixed'
  | 'error';

export interface ResponseData {
  type: 'table' | 'list' | 'metrics' | 'timeline';
  title: string;
  headers?: string[];
  rows?: (string | number)[][];
  items?: DataItem[];
}

export interface DataItem {
  label: string;
  value: string | number;
  type?: 'text' | 'number' | 'status' | 'link';
  metadata?: Record<string, unknown>;
}

export interface Visualization {
  type: VisualizationType;
  title: string;
  data: unknown;
  config?: Record<string, unknown>;
}

export type VisualizationType =
  | 'bar_chart'
  | 'line_chart'
  | 'pie_chart'
  | 'area_chart'
  | 'scatter_plot'
  | 'heatmap'
  | 'treemap'
  | 'graph'
  | 'table'
  | 'timeline'
  | 'matrix'
  | 'sankey'
  | 'world_map';

export interface RecommendedAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  parameters: Record<string, unknown>;
  requiresApproval: boolean;
}

export type ActionType =
  | 'isolate_host'
  | 'block_ip'
  | 'block_domain'
  | 'disable_user'
  | 'rotate_credentials'
  | 'run_playbook'
  | 'create_incident'
  | 'update_firewall'
  | 'deploy_patch'
  | 'notify_team'
  | 'generate_report'
  | 'export_data';

export interface DataSource {
  id: string;
  name: string;
  type: string;
  relevance: number;
  timestamp: Date;
}

// ============================================================================
// AI Engine Class
// ============================================================================

export class AIEngine {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-4-turbo-preview';
    this.temperature = config.temperature || 0.3;
    this.maxTokens = config.maxTokens || 4096;
  }

  async processQuery(query: AIQuery): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // Build context-aware prompt
      const prompt = this.buildPrompt(query);

      // Process with AI model
      const response = await this.callAI(prompt);

      // Parse and structure response
      const structuredResponse = this.parseResponse(response);

      // Generate visualizations if needed
      const visualizations = await this.generateVisualizations(structuredResponse, query.context);

      // Generate recommended actions
      const actions = this.generateActions(structuredResponse, query.context);

      const processingTime = Date.now() - startTime;

      return {
        ...structuredResponse,
        visualizations,
        actions,
        confidence: this.calculateConfidence(structuredResponse),
      };
    } catch (error) {
      return {
        content: `Error processing query: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        confidence: 0,
      };
    }
  }

  private buildPrompt(query: AIQuery): string {
    const contextInfo = `
Organization: ${query.context.organizationId}
User Role: ${query.context.userRole}
Current Module: ${query.context.currentModule || 'General'}
Timestamp: ${query.context.timestamp.toISOString()}
`;

    const systemPrompt = `You are BlackSentinel AI Command, the unified AI copilot for enterprise cybersecurity.

Your capabilities:
1. Analyze security data from across the entire BlackSentinel ecosystem
2. Provide context-aware recommendations based on user role
3. Generate visualizations and data summaries
4. Explain complex security concepts in plain language
5. Prioritize actions based on risk and business impact
6. Correlate events across multiple data sources

Context:
${contextInfo}

Guidelines:
- Always consider the user's role when providing information
- Prioritize critical and high-risk items
- Provide actionable recommendations
- Use clear, concise language
- Include relevant metrics and data when available
- Suggest visualizations when they would enhance understanding
- Never expose sensitive data unless explicitly authorized`;

    return `${systemPrompt}\n\nUser Query: ${query.query}`;
  }

  private async callAI(prompt: string): Promise<string> {
    // In production, this would call the actual AI API
    // For now, we'll simulate a response
    return this.simulateResponse(prompt);
  }

  private simulateResponse(prompt: string): string {
    // Simulated response for demonstration
    return JSON.stringify({
      content: "I've analyzed your security posture. Here are the key findings:",
      findings: [
        { type: 'critical', count: 3, description: 'Critical vulnerabilities requiring immediate attention' },
        { type: 'high', count: 12, description: 'High-severity issues that should be addressed soon' },
        { type: 'medium', count: 25, description: 'Medium-severity findings for tracking' },
      ],
      recommendations: [
        'Patch CVE-2024-1234 on all affected servers',
        'Rotate credentials for compromised accounts',
        'Enable additional monitoring on suspicious activities',
      ],
    });
  }

  private parseResponse(response: string): AIResponse {
    try {
      const data = JSON.parse(response);
      return {
        content: data.content || 'Analysis complete',
        type: 'mixed',
        data: data.findings ? [{
          type: 'metrics',
          title: 'Security Findings',
          items: data.findings.map((f: any) => ({
            label: f.type.charAt(0).toUpperCase() + f.type.slice(1),
            value: f.count,
            type: 'number',
            metadata: { description: f.description },
          })),
        }] : undefined,
        confidence: 0.85,
      };
    } catch {
      return {
        content: response,
        type: 'text',
        confidence: 0.7,
      };
    }
  }

  private async generateVisualizations(
    response: AIResponse,
    context: QueryContext
  ): Promise<Visualization[]> {
    const visualizations: Visualization[] = [];

    // Generate appropriate visualizations based on response type
    if (response.data) {
      for (const dataItem of response.data) {
        if (dataItem.type === 'metrics') {
          visualizations.push({
            type: 'bar_chart',
            title: dataItem.title,
            data: dataItem.items,
          });
        }
      }
    }

    return visualizations;
  }

  private generateActions(
    response: AIResponse,
    context: QueryContext
  ): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    // Generate actions based on findings and user role
    if (context.userRole === 'ciso' || context.userRole === 'soc_analyst') {
      actions.push({
        id: crypto.randomUUID(),
        type: 'generate_report',
        title: 'Generate Executive Summary',
        description: 'Create an executive summary of the analysis',
        priority: 'medium',
        parameters: { format: 'pdf', includeCharts: true },
        requiresApproval: false,
      });
    }

    return actions;
  }

  private calculateConfidence(response: AIResponse): number {
    // Calculate confidence score based on response quality
    let confidence = 0.7; // Base confidence

    if (response.data && response.data.length > 0) confidence += 0.1;
    if (response.visualizations && response.visualizations.length > 0) confidence += 0.1;
    if (response.actions && response.actions.length > 0) confidence += 0.05;
    if (response.sources && response.sources.length > 0) confidence += 0.05;

    return Math.min(confidence, 1);
  }

  // Specialized analysis methods
  async analyzeVulnerability(vulnerabilityId: string): Promise<AIResponse> {
    const query: AIQuery = {
      id: crypto.randomUUID(),
      query: `Analyze vulnerability ${vulnerabilityId} and provide risk assessment, affected assets, and remediation steps`,
      status: 'processing',
      context: {
        organizationId: 'current',
        userId: 'current',
        userRole: 'security_engineer',
        currentModule: 'vulnerabilities',
        timestamp: new Date(),
      },
      metadata: {
        tokens: 0,
        processingTime: 0,
        model: this.model,
        confidence: 0,
      },
      createdAt: new Date(),
    };

    return this.processQuery(query);
  }

  async analyzeIncident(incidentId: string): Promise<AIResponse> {
    const query: AIQuery = {
      id: crypto.randomUUID(),
      query: `Analyze incident ${incidentId} and provide timeline, impact assessment, and response recommendations`,
      status: 'processing',
      context: {
        organizationId: 'current',
        userId: 'current',
        userRole: 'soc_analyst',
        currentModule: 'incidents',
        timestamp: new Date(),
      },
      metadata: {
        tokens: 0,
        processingTime: 0,
        model: this.model,
        confidence: 0,
      },
      createdAt: new Date(),
    };

    return this.processQuery(query);
  }

  async generateSecurityReport(options: {
    type: 'executive' | 'technical' | 'compliance';
    timeRange: string;
    includeCharts: boolean;
  }): Promise<AIResponse> {
    const query: AIQuery = {
      id: crypto.randomUUID(),
      query: `Generate a ${options.type} security report for the last ${options.timeRange}${options.includeCharts ? ' with visualizations' : ''}`,
      status: 'processing',
      context: {
        organizationId: 'current',
        userId: 'current',
        userRole: 'ciso',
        currentModule: 'reports',
        timestamp: new Date(),
      },
      metadata: {
        tokens: 0,
        processingTime: 0,
        model: this.model,
        confidence: 0,
      },
      createdAt: new Date(),
    };

    return this.processQuery(query);
  }

  async explainAttack(attackDescription: string): Promise<AIResponse> {
    const query: AIQuery = {
      id: crypto.randomUUID(),
      query: `Explain this attack in detail: ${attackDescription}. Include MITRE ATT&CK techniques, indicators, and defensive measures`,
      status: 'processing',
      context: {
        organizationId: 'current',
        userId: 'current',
        userRole: 'security_engineer',
        currentModule: 'threat-intelligence',
        timestamp: new Date(),
      },
      metadata: {
        tokens: 0,
        processingTime: 0,
        model: this.model,
        confidence: 0,
      },
      createdAt: new Date(),
    };

    return this.processQuery(query);
  }

  async getPrioritizedActions(): Promise<AIResponse> {
    const query: AIQuery = {
      id: crypto.randomUUID(),
      query: 'What should I fix first? Provide a prioritized list of actions based on risk and business impact',
      status: 'processing',
      context: {
        organizationId: 'current',
        userId: 'current',
        userRole: 'security_engineer',
        currentModule: 'overview',
        timestamp: new Date(),
      },
      metadata: {
        tokens: 0,
        processingTime: 0,
        model: this.model,
        confidence: 0,
      },
      createdAt: new Date(),
    };

    return this.processQuery(query);
  }
}

// ============================================================================
// Prompt Templates
// ============================================================================

export const PROMPT_TEMPLATES = {
  vulnerabilityAnalysis: `
Analyze vulnerability {vulnerabilityId}:
1. Risk assessment (CVSS score, exploitability, impact)
2. Affected assets in the organization
3. Remediation steps and timeline
4. Related threats and campaigns
5. Business impact analysis
`,

  incidentAnalysis: `
Analyze incident {incidentId}:
1. Timeline reconstruction
2. Attack vector and technique (MITRE ATT&CK)
3. Affected systems and data
4. Impact assessment
5. Containment and eradication steps
6. Lessons learned and prevention
`,

  securityReport: `
Generate a {reportType} security report:
1. Executive summary
2. Key metrics and trends
3. Critical findings
4. Risk assessment
5. Recommendations
6. Compliance status
7. Action items
`,

  attackExplanation: `
Explain this attack: {attackDescription}
1. Attack overview and objectives
2. MITRE ATT&CK mapping
3. Indicators of compromise (IOCs)
4. Detection methods
5. Prevention measures
6. Similar known campaigns
`,

  prioritizedActions: `
Prioritize security actions:
1. Analyze current vulnerabilities and threats
2. Assess business impact and risk
3. Consider resource availability
4. Rank by urgency and impact
5. Provide specific, actionable steps
`,
};

export default AIEngine;
