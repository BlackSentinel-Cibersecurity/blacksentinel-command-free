'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import { Input } from '@blacksentinel/ds/components/input';
import { 
  Box, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Users,
  Server,
  Globe,
  Lock,
  AlertTriangle,
  Shield,
  Database,
  Key,
  Cpu,
  Network,
  Wifi,
  HardDrive,
  Monitor,
  Smartphone,
  Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssetsPage() {
  const [viewMode, setViewMode] = React.useState<'graph' | 'list' | 'table'>('graph');
  const [selectedNode, setSelectedNode] = React.useState<any>(null);

  const assetNodes = [
    { id: 'org', type: 'organization', label: 'Acme Corp', icon: <Shield className="h-6 w-6" />, count: 1, risk: 'medium' },
    { id: 'users', type: 'group', label: 'Users', icon: <Users className="h-5 w-5" />, count: 3456, risk: 'low' },
    { id: 'servers', type: 'group', label: 'Servers', icon: <Server className="h-5 w-5" />, count: 142, risk: 'medium' },
    { id: 'containers', type: 'group', label: 'Containers', icon: <Box className="h-5 w-5" />, count: 1247, risk: 'low' },
    { id: 'cloud', type: 'group', label: 'Cloud', icon: <Cloud className="h-5 w-5" />, count: 89, risk: 'high' },
    { id: 'network', type: 'group', label: 'Network', icon: <Network className="h-5 w-5" />, count: 67, risk: 'low' },
    { id: 'endpoints', type: 'group', label: 'Endpoints', icon: <Monitor className="h-5 w-5" />, count: 3456, risk: 'medium' },
    { id: 'mobile', type: 'group', label: 'Mobile', icon: <Smartphone className="h-5 w-5" />, count: 234, risk: 'low' },
    { id: 'iot', type: 'group', label: 'IoT/OT', icon: <Cpu className="h-5 w-5" />, count: 89, risk: 'high' },
    { id: 'databases', type: 'group', label: 'Databases', icon: <Database className="h-5 w-5" />, count: 56, risk: 'critical' },
    { id: 'secrets', type: 'group', label: 'Secrets', icon: <Key className="h-5 w-5" />, count: 1247, risk: 'medium' },
  ];

  const riskColors = {
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Asset Graph</h1>
          <p className="text-sm text-gray-400">
            Interactive visualization of your entire digital ecosystem
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-1">
            {[
              { id: 'graph', label: 'Graph' },
              { id: 'list', label: 'List' },
              { id: 'table', label: 'Table' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  viewMode === mode.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Graph View */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Graph</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-[600px] rounded-xl border border-gray-800 bg-gray-900/50">
              {/* Simulated Graph Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Central Node */}
                  <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-orange-500 bg-gray-900 shadow-lg shadow-orange-500/20">
                      <Shield className="h-8 w-8 text-orange-400" />
                    </div>
                    <p className="mt-2 text-center text-xs font-medium text-white">Acme Corp</p>
                  </div>

                  {/* Surrounding Nodes */}
                  {assetNodes.slice(1).map((node, index) => {
                    const angle = (index * 360) / (assetNodes.length - 1);
                    const radius = 200;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <div
                        key={node.id}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px - 32px)`,
                          top: `calc(50% + ${y}px - 32px)`,
                        }}
                      >
                        <div
                          className={cn(
                            'flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border transition-all hover:scale-110',
                            riskColors[node.risk as keyof typeof riskColors]
                          )}
                          onClick={() => setSelectedNode(node)}
                        >
                          {node.icon}
                        </div>
                        <p className="mt-1 text-center text-[10px] font-medium text-gray-400">
                          {node.label}
                        </p>
                        <p className="text-center text-[10px] text-gray-500">
                          {node.count.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}

                  {/* Connection Lines (simulated) */}
                  <svg className="absolute inset-0 h-full w-full" style={{ zIndex: -1 }}>
                    {assetNodes.slice(1).map((node, index) => {
                      const angle = (index * 360) / (assetNodes.length - 1);
                      const radius = 200;
                      const x = Math.cos((angle * Math.PI) / 180) * radius + 300;
                      const y = Math.sin((angle * Math.PI) / 180) * radius + 300;

                      return (
                        <line
                          key={node.id}
                          x1="300"
                          y1="300"
                          x2={x}
                          y2={y}
                          stroke="#3C3C3C"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-lg border border-gray-700 bg-gray-800/90 p-3">
                <p className="mb-2 text-xs font-medium text-gray-400">Risk Levels</p>
                <div className="space-y-1">
                  {[
                    { level: 'Critical', color: 'bg-red-500' },
                    { level: 'High', color: 'bg-orange-500' },
                    { level: 'Medium', color: 'bg-yellow-500' },
                    { level: 'Low', color: 'bg-green-500' },
                  ].map((item) => (
                    <div key={item.level} className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', item.color)} />
                      <span className="text-[10px] text-gray-400">{item.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute right-4 top-4 rounded-lg border border-gray-700 bg-gray-800/90 p-2">
                <div className="flex flex-col gap-1">
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Asset Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assetNodes.map((node) => (
                  <div
                    key={node.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-800/50 cursor-pointer',
                      riskColors[node.risk as keyof typeof riskColors]
                    )}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-3">
                      {node.icon}
                      <div>
                        <p className="text-sm font-medium text-white">{node.label}</p>
                        <p className="text-xs text-gray-400">{node.count.toLocaleString()} assets</p>
                      </div>
                    </div>
                    <Badge variant={node.risk as any} size="sm">
                      {node.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card variant="glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedNode.label}</CardTitle>
                  <Badge variant={selectedNode.risk as any}>
                    {selectedNode.risk}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                      <p className="text-xs text-gray-400">Total Assets</p>
                      <p className="text-lg font-bold text-white">{selectedNode.count.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                      <p className="text-xs text-gray-400">Risk Level</p>
                      <p className="text-lg font-bold text-white capitalize">{selectedNode.risk}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Search className="mr-2 h-3 w-3" />
                        Scan
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Filter className="mr-2 h-3 w-3" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
