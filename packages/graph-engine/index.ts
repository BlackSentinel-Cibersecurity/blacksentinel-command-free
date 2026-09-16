// BlackSentinel Graph Engine
// Powerful graph visualization and analysis engine for security data

import * as d3 from 'd3';

// ============================================================================
// Types
// ============================================================================

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export type NodeType =
  | 'user'
  | 'asset'
  | 'server'
  | 'container'
  | 'cloud'
  | 'vulnerability'
  | 'alert'
  | 'incident'
  | 'campaign'
  | 'apt'
  | 'ioc'
  | 'domain'
  | 'ip'
  | 'certificate'
  | 'secret'
  | 'automation'
  | 'policy'
  | 'control';

export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: EdgeType;
  properties: Record<string, unknown>;
  weight?: number;
}

export type EdgeType =
  | 'owns'
  | 'uses'
  | 'connects_to'
  | 'contains'
  | 'protects'
  | 'targets'
  | 'affects'
  | 'triggers'
  | 'resolves'
  | 'depends_on'
  | 'communicates_with'
  | 'has_vulnerability'
  | 'is_affected_by'
  | 'mitigates'
  | 'monitors';

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphMetadata {
  id: string;
  name: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  nodeCount: number;
  edgeCount: number;
}

export interface GraphQuery {
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  properties?: Record<string, unknown>;
  depth?: number;
  limit?: number;
}

export interface GraphAnalytics {
  centrality: Map<string, number>;
  clusters: Map<string, string[]>;
  paths: Array<{ source: string; target: string; path: string[] }>;
  communities: Map<string, number>;
}

// ============================================================================
// Graph Engine Class
// ============================================================================

export class GraphEngine {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();
  private metadata: GraphMetadata;

  constructor(name: string = 'BlackSentinel Graph') {
    this.metadata = {
      id: crypto.randomUUID(),
      name,
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodeCount: 0,
      edgeCount: 0,
    };
  }

  // Node Operations
  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, new Set());
    }
    this.metadata.nodeCount = this.nodes.size;
    this.metadata.updatedAt = new Date();
  }

  removeNode(id: string): void {
    this.nodes.delete(id);
    this.adjacencyList.delete(id);
    // Remove all edges connected to this node
    for (const [edgeId, edge] of this.edges) {
      if (
        (typeof edge.source === 'string' && edge.source === id) ||
        (typeof edge.target === 'string' && edge.target === id) ||
        (typeof edge.source === 'object' && edge.source.id === id) ||
        (typeof edge.target === 'object' && edge.target.id === id)
      ) {
        this.edges.delete(edgeId);
      }
    }
    this.metadata.nodeCount = this.nodes.size;
    this.metadata.edgeCount = this.edges.size;
    this.metadata.updatedAt = new Date();
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getNodesByType(type: NodeType): GraphNode[] {
    return Array.from(this.nodes.values()).filter(node => node.type === type);
  }

  // Edge Operations
  addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
    
    if (!this.adjacencyList.has(sourceId)) {
      this.adjacencyList.set(sourceId, new Set());
    }
    if (!this.adjacencyList.has(targetId)) {
      this.adjacencyList.set(targetId, new Set());
    }
    
    this.adjacencyList.get(sourceId)!.add(targetId);
    this.adjacencyList.get(targetId)!.add(sourceId);
    
    this.metadata.edgeCount = this.edges.size;
    this.metadata.updatedAt = new Date();
  }

  removeEdge(id: string): void {
    const edge = this.edges.get(id);
    if (edge) {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
      
      this.adjacencyList.get(sourceId)?.delete(targetId);
      this.adjacencyList.get(targetId)?.delete(sourceId);
      
      this.edges.delete(id);
      this.metadata.edgeCount = this.edges.size;
      this.metadata.updatedAt = new Date();
    }
  }

  getEdgesByType(type: EdgeType): GraphEdge[] {
    return Array.from(this.edges.values()).filter(edge => edge.type === type);
  }

  // Query Operations
  query(query: GraphQuery): Graph {
    let filteredNodes = Array.from(this.nodes.values());

    if (query.nodeTypes && query.nodeTypes.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        query.nodeTypes!.includes(node.type)
      );
    }

    if (query.properties) {
      filteredNodes = filteredNodes.filter(node =>
        Object.entries(query.properties!).every(([key, value]) =>
          node.properties[key] === value
        )
      );
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    let filteredEdges = Array.from(this.edges.values()).filter(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    if (query.edgeTypes && query.edgeTypes.length > 0) {
      filteredEdges = filteredEdges.filter(edge =>
        query.edgeTypes!.includes(edge.type)
      );
    }

    if (query.limit) {
      filteredNodes = filteredNodes.slice(0, query.limit);
    }

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
      metadata: {
        ...this.metadata,
        nodeCount: filteredNodes.length,
        edgeCount: filteredEdges.length,
      },
    };
  }

  // Traversal Operations
  getNeighbors(nodeId: string, depth: number = 1): Graph {
    const visited = new Set<string>();
    const resultNodes: GraphNode[] = [];
    const resultEdges: GraphEdge[] = [];

    const traverse = (currentId: string, currentDepth: number) => {
      if (currentDepth > depth || visited.has(currentId)) return;
      visited.add(currentId);

      const node = this.nodes.get(currentId);
      if (node) {
        resultNodes.push(node);
      }

      const neighbors = this.adjacencyList.get(currentId) || new Set();
      for (const neighborId of neighbors) {
        const edge = Array.from(this.edges.values()).find(e => {
          const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
          const targetId = typeof e.target === 'string' ? e.target : e.target.id;
          return (sourceId === currentId && targetId === neighborId) ||
                 (sourceId === neighborId && targetId === currentId);
        });

        if (edge) {
          resultEdges.push(edge);
        }

        traverse(neighborId, currentDepth + 1);
      }
    };

    traverse(nodeId, 0);

    return {
      nodes: resultNodes,
      edges: resultEdges,
      metadata: {
        ...this.metadata,
        nodeCount: resultNodes.length,
        edgeCount: resultEdges.length,
      },
    };
  }

  // Analytics Operations
  calculateCentrality(): Map<string, number> {
    const centrality = new Map<string, number>();
    const n = this.nodes.size;

    for (const nodeId of this.nodes.keys()) {
      const neighbors = this.adjacencyList.get(nodeId) || new Set();
      centrality.set(nodeId, neighbors.size / (n - 1));
    }

    return centrality;
  }

  detectCommunities(): Map<string, number> {
    const communities = new Map<string, number>();
    const visited = new Set<string>();
    let communityId = 0;

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        const queue = [nodeId];
        while (queue.length > 0) {
          const current = queue.shift()!;
          if (!visited.has(current)) {
            visited.add(current);
            communities.set(current, communityId);
            const neighbors = this.adjacencyList.get(current) || new Set();
            for (const neighbor of neighbors) {
              if (!visited.has(neighbor)) {
                queue.push(neighbor);
              }
            }
          }
        }
        communityId++;
      }
    }

    return communities;
  }

  findPath(sourceId: string, targetId: string, maxDepth: number = 10): string[] | null {
    const visited = new Set<string>();
    const queue: Array<{ id: string; path: string[] }> = [{ id: sourceId, path: [sourceId] }];

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      
      if (id === targetId) {
        return path;
      }

      if (path.length > maxDepth) {
        continue;
      }

      if (!visited.has(id)) {
        visited.add(id);
        const neighbors = this.adjacencyList.get(id) || new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push({ id: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }

    return null;
  }

  // Export Operations
  toReactFlow(): { nodes: any[]; edges: any[] } {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      type: 'custom',
      position: { x: node.x || 0, y: node.y || 0 },
      data: {
        label: node.label,
        type: node.type,
        properties: node.properties,
      },
    }));

    const edges = Array.from(this.edges.values()).map(edge => ({
      id: edge.id,
      source: typeof edge.source === 'string' ? edge.source : edge.source.id,
      target: typeof edge.target === 'string' ? edge.target : edge.target.id,
      type: 'custom',
      data: {
        type: edge.type,
        properties: edge.properties,
        weight: edge.weight,
      },
    }));

    return { nodes, edges };
  }

  toJSON(): Graph {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      metadata: this.metadata,
    };
  }

  static fromJSON(data: Graph): GraphEngine {
    const engine = new GraphEngine(data.metadata.name);
    
    for (const node of data.nodes) {
      engine.addNode(node);
    }
    
    for (const edge of data.edges) {
      engine.addEdge(edge);
    }

    return engine;
  }
}

// ============================================================================
// Layout Algorithms
// ============================================================================

export function forceDirectedLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: {
    width?: number;
    height?: number;
    strength?: number;
    distance?: number;
  }
): void {
  const width = options?.width || 800;
  const height = options?.height || 600;
  const strength = options?.strength || -300;
  const distance = options?.distance || 100;

  const simulation = d3.forceSimulation(nodes as any)
    .force('link', d3.forceLink(edges as any).id((d: any) => d.id).distance(distance))
    .force('charge', d3.forceManyBody().strength(strength))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(50));

  simulation.tick(300);
  simulation.stop();
}

export function hierarchicalLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: {
    width?: number;
    height?: number;
    nodeSize?: number;
  }
): void {
  const width = options?.width || 800;
  const height = options?.height || 600;
  const nodeSize = options?.nodeSize || 50;

  // Build hierarchy
  const root = nodes.find(n => !edges.some(e => {
    const targetId = typeof e.target === 'string' ? e.target : e.target.id;
    return targetId === n.id;
  })) || nodes[0];

  const hierarchy = d3.hierarchy(root, (node) => {
    return edges
      .filter(e => {
        const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
        return sourceId === node.id;
      })
      .map(e => {
        const targetId = typeof e.target === 'string' ? e.target : e.target.id;
        return nodes.find(n => n.id === targetId);
      })
      .filter((n): n is GraphNode => n !== undefined);
  });

  const treeLayout = d3.tree().size([width, height - 100]);
  treeLayout(hierarchy as any);

  // Apply positions
  hierarchy.each((node: any) => {
    const graphNode = nodes.find(n => n.id === node.data.id);
    if (graphNode) {
      graphNode.x = node.x;
      graphNode.y = node.y;
    }
  });
}

// ============================================================================
// Visualization Helpers
// ============================================================================

export function getNodeColor(type: NodeType): string {
  const colors: Record<NodeType, string> = {
    user: '#3B82F6',
    asset: '#6B7280',
    server: '#8B5CF6',
    container: '#06B6D4',
    cloud: '#0EA5E9',
    vulnerability: '#EF4444',
    alert: '#F59E0B',
    incident: '#DC2626',
    campaign: '#EC4899',
    apt: '#BE185D',
    ioc: '#F97316',
    domain: '#10B981',
    ip: '#14B8A6',
    certificate: '#84CC16',
    secret: '#F43F5E',
    automation: '#FF6B00',
    policy: '#6366F1',
    control: '#8B5CF6',
  };
  return colors[type] || '#6B7280';
}

export function getEdgeColor(type: EdgeType): string {
  const colors: Record<EdgeType, string> = {
    owns: '#3B82F6',
    uses: '#6B7280',
    connects_to: '#10B981',
    contains: '#8B5CF6',
    protects: '#22C55E',
    targets: '#EF4444',
    affects: '#F59E0B',
    triggers: '#EC4899',
    resolves: '#10B981',
    depends_on: '#6366F1',
    communicates_with: '#06B6D4',
    has_vulnerability: '#EF4444',
    is_affected_by: '#F97316',
    mitigates: '#22C55E',
    monitors: '#3B82F6',
  };
  return colors[type] || '#6B7280';
}

export function getNodeSize(type: NodeType): number {
  const sizes: Record<NodeType, number> = {
    user: 30,
    asset: 25,
    server: 35,
    container: 25,
    cloud: 40,
    vulnerability: 20,
    alert: 25,
    incident: 35,
    campaign: 40,
    apt: 45,
    ioc: 15,
    domain: 20,
    ip: 15,
    certificate: 15,
    secret: 15,
    automation: 25,
    policy: 25,
    control: 25,
  };
  return sizes[type] || 25;
}

export default GraphEngine;
