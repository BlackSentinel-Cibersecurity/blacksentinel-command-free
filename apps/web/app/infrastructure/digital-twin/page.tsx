'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import { StatusIndicator } from '@blacksentinel/ds/components/status-indicator';
import {
  Box,
  Server,
  Globe,
  Network,
  Database,
  Cloud,
  Shield,
  Lock,
  Activity,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DigitalTwinPage() {
  const [selectedNode, setSelectedNode] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<'topology' | 'dependencies' | 'risks'>('topology');

  const infrastructureNodes = [
    {
      id: 'cloud-aws',
      type: 'cloud',
      name: 'AWS Cloud',
      status: 'healthy',
      provider: 'Amazon Web Services',
      resources: 89,
      risk: 'low',
      children: [
        { id: 'vpc-prod', type: 'network', name: 'Production VPC', status: 'healthy', risk: 'low' },
        { id: 'vpc-dev', type: 'network', name: 'Development VPC', status: 'healthy', risk: 'low' },
      ],
    },
    {
      id: 'cloud-azure',
      type: 'cloud',
      name: 'Azure Cloud',
      status: 'healthy',
      provider: 'Microsoft Azure',
      resources: 53,
      risk: 'low',
      children: [
        { id: 'rg-prod', type: 'network', name: 'Production Resource Group', status: 'healthy', risk: 'low' },
      ],
    },
    {
      id: 'k8s-cluster',
      type: 'container',
      name: 'Kubernetes Cluster',
      status: 'warning',
      provider: 'EKS',
      resources: 234,
      risk: 'medium',
      children: [
        { id: 'ns-production', type: 'container', name: 'Production Namespace', status: 'healthy', risk: 'low' },
        { id: 'ns-staging', type: 'container', name: 'Staging Namespace', status: 'warning', risk: 'medium' },
      ],
    },
    {
      id: 'db-cluster',
      type: 'database',
      name: 'Database Cluster',
      status: 'critical',
      provider: 'PostgreSQL',
      resources: 12,
      risk: 'critical',
      children: [
        { id: 'db-primary', type: 'database', name: 'Primary Database', status: 'critical', risk: 'critical' },
        { id: 'db-replica', type: 'database', name: 'Read Replica', status: 'warning', risk: 'medium' },
      ],
    },
    {
      id: 'network-core',
      type: 'network',
      name: 'Core Network',
      status: 'healthy',
      provider: 'Cisco',
      resources: 67,
      risk: 'low',
      children: [
        { id: 'fw-edge', type: 'network', name: 'Edge Firewall', status: 'healthy', risk: 'low' },
        { id: 'sw-core', type: 'network', name: 'Core Switch', status: 'healthy', risk: 'low' },
      ],
    },
  ];

  const dependencies = [
    { source: 'cloud-aws', target: 'k8s-cluster', type: 'hosts', status: 'healthy' },
    { source: 'k8s-cluster', target: 'db-cluster', type: 'connects_to', status: 'critical' },
    { source: 'cloud-azure', target: 'k8s-cluster', type: 'replicates_to', status: 'healthy' },
    { source: 'network-core', target: 'cloud-aws', type: 'routes_to', status: 'healthy' },
    { source: 'network-core', target: 'cloud-azure', type: 'routes_to', status: 'healthy' },
  ];

  const recentEvents = [
    { time: '14:32', type: 'critical', event: 'Database connection pool exhausted', component: 'db-primary' },
    { time: '14:28', type: 'warning', event: 'High memory usage on staging nodes', component: 'ns-staging' },
    { time: '14:15', type: 'info', event: 'Auto-scaling triggered for production', component: 'ns-production' },
    { time: '13:45', type: 'success', event: 'Certificate renewed successfully', component: 'fw-edge' },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    cloud: <Cloud className="h-5 w-5" />,
    network: <Network className="h-5 w-5" />,
    container: <Box className="h-5 w-5" />,
    database: <Database className="h-5 w-5" />,
    server: <Server className="h-5 w-5" />,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Twin</h1>
          <p className="text-sm text-gray-400">
            Real-time digital representation of your entire infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-1">
            {['topology', 'dependencies', 'risks'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  viewMode === mode
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="mr-2 h-4 w-4" />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 3D Visualization Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Infrastructure Topology</CardTitle>
              <Badge variant="info">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-[600px] rounded-xl border border-gray-800 bg-gray-900/50">
              {/* Simulated 3D View */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Central Hub */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-orange-500 bg-gray-900 shadow-lg shadow-orange-500/20">
                      <Shield className="h-10 w-10 text-orange-400" />
                    </div>
                    <p className="mt-2 text-center text-xs font-medium text-white">BlackSentinel</p>
                  </div>

                  {/* Cloud Nodes */}
                  {infrastructureNodes.map((node, index) => {
                    const angle = (index * 360) / infrastructureNodes.length - 90;
                    const radius = 220;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <div
                        key={node.id}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px - 40px)`,
                          top: `calc(50% + ${y}px - 40px)`,
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSelectedNode(node)}
                          className={cn(
                            'flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 transition-all',
                            node.status === 'healthy' && 'border-green-500/50 bg-green-500/10',
                            node.status === 'warning' && 'border-yellow-500/50 bg-yellow-500/10',
                            node.status === 'critical' && 'border-red-500/50 bg-red-500/10 animate-pulse'
                          )}
                        >
                          <div className={cn(
                            'text-2xl',
                            node.status === 'healthy' && 'text-green-400',
                            node.status === 'warning' && 'text-yellow-400',
                            node.status === 'critical' && 'text-red-400'
                          )}>
                            {typeIcons[node.type] || <Box className="h-5 w-5" />}
                          </div>
                        </motion.div>
                        <p className="mt-2 text-center text-[10px] font-medium text-white max-w-[100px] truncate">
                          {node.name}
                        </p>
                        <p className="text-center text-[10px] text-gray-500">
                          {node.resources} resources
                        </p>
                      </div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 h-full w-full" style={{ zIndex: -1 }}>
                    {dependencies.map((dep, index) => {
                      const sourceNode = infrastructureNodes.find(n => n.id === dep.source);
                      const targetNode = infrastructureNodes.find(n => n.id === dep.target);
                      
                      if (!sourceNode || !targetNode) return null;

                      const sourceIndex = infrastructureNodes.indexOf(sourceNode);
                      const targetIndex = infrastructureNodes.indexOf(targetNode);
                      
                      const sourceAngle = (sourceIndex * 360) / infrastructureNodes.length - 90;
                      const targetAngle = (targetIndex * 360) / infrastructureNodes.length - 90;
                      const radius = 220;
                      
                      const x1 = Math.cos((sourceAngle * Math.PI) / 180) * radius + 300;
                      const y1 = Math.sin((sourceAngle * Math.PI) / 180) * radius + 300;
                      const x2 = Math.cos((targetAngle * Math.PI) / 180) * radius + 300;
                      const y2 = Math.sin((targetAngle * Math.PI) / 180) * radius + 300;

                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={dep.status === 'critical' ? '#EF4444' : dep.status === 'warning' ? '#FACC15' : '#3C3C3C'}
                          strokeWidth="2"
                          strokeDasharray={dep.status === 'critical' ? '5,5' : 'none'}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-lg border border-gray-700 bg-gray-800/90 p-3">
                <p className="mb-2 text-xs font-medium text-gray-400">Status</p>
                <div className="space-y-1">
                  {[
                    { status: 'Healthy', color: 'bg-green-500' },
                    { status: 'Warning', color: 'bg-yellow-500' },
                    { status: 'Critical', color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', item.color)} />
                      <span className="text-[10px] text-gray-400">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute right-4 top-4 rounded-lg border border-gray-700 bg-gray-800/90 p-2">
                <div className="flex flex-col gap-1">
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Selected Node Details */}
          {selectedNode ? (
            <Card variant="glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedNode.name}</CardTitle>
                  <StatusIndicator variant="badge" status={selectedNode.status as any} size="sm" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                      <p className="text-xs text-gray-400">Resources</p>
                      <p className="text-lg font-bold text-white">{selectedNode.resources}</p>
                    </div>
                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                      <p className="text-xs text-gray-400">Risk Level</p>
                      <Badge variant={selectedNode.risk as any} className="mt-1">
                        {selectedNode.risk}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                    <p className="text-xs text-gray-400">Provider</p>
                    <p className="text-sm font-medium text-white">{selectedNode.provider}</p>
                  </div>
                  {selectedNode.children && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-400">Child Components</p>
                      <div className="space-y-2">
                        {selectedNode.children.map((child: any) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-2"
                          >
                            <div className="flex items-center gap-2">
                              {typeIcons[child.type] || <Box className="h-4 w-4" />}
                              <span className="text-xs text-white">{child.name}</span>
                            </div>
                            <StatusIndicator variant="dot" status={child.status as any} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Activity className="mr-2 h-3 w-3" />
                      Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Box className="h-12 w-12 text-gray-600" />
                <p className="mt-4 text-sm text-gray-400">Select a component</p>
                <p className="text-xs text-gray-500">Click on any node to view details</p>
              </CardContent>
            </Card>
          )}

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        event.type === 'critical' && 'bg-red-500',
                        event.type === 'warning' && 'bg-yellow-500',
                        event.type === 'info' && 'bg-blue-500',
                        event.type === 'success' && 'bg-green-500'
                      )} />
                      <span className="text-[10px] text-gray-500">{event.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-white">{event.event}</p>
                    <p className="mt-1 text-[10px] text-gray-500">Component: {event.component}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dependencies */}
          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dependencies.slice(0, 5).map((dep, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-2"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white">{dep.source}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-white">{dep.target}</span>
                    </div>
                    <Badge
                      variant={dep.status === 'critical' ? 'critical' : dep.status === 'warning' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {dep.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
