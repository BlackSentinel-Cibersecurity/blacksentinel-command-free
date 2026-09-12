'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { MetricCard } from '@blacksentinel/ds/components/metric-card';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import { StatusIndicator } from '@blacksentinel/ds/components/status-indicator';
import { 
  Server, 
  Cloud, 
  Box, 
  Network, 
  Shield, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi,
  Globe,
  Database,
  Lock,
  Eye,
  RefreshCw,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InfrastructurePage() {
  const [viewMode, setViewMode] = React.useState<'overview' | 'map' | 'list'>('overview');

  const infrastructureStats = [
    { name: 'Cloud Servers', count: 142, status: 'healthy', icon: <Cloud className="h-5 w-5" />, provider: 'AWS/Azure' },
    { name: 'Containers', count: 1247, status: 'healthy', icon: <Box className="h-5 w-5" />, provider: 'Kubernetes' },
    { name: 'Virtual Machines', count: 89, status: 'warning', icon: <Server className="h-5 w-5" />, provider: 'VMware' },
    { name: 'Network Devices', count: 67, status: 'healthy', icon: <Network className="h-5 w-5" />, provider: 'Cisco' },
    { name: 'Databases', count: 56, status: 'critical', icon: <Database className="h-5 w-5" />, provider: 'PostgreSQL/MySQL' },
    { name: 'Endpoints', count: 3456, status: 'healthy', icon: <HardDrive className="h-5 w-5" />, provider: 'Windows/Mac/Linux' },
    { name: 'Mobile Devices', count: 234, status: 'healthy', icon: <Globe className="h-5 w-5" />, provider: 'iOS/Android' },
    { name: 'IoT/OT Devices', count: 89, status: 'warning', icon: <Cpu className="h-5 w-5" />, provider: 'Various' },
  ];

  const topIssues = [
    { severity: 'critical', title: 'Database server-db-01 unresponsive', time: '5 min ago', affected: ['PostgreSQL', 'Production'] },
    { severity: 'high', title: 'High CPU usage on container-pool-03', time: '15 min ago', affected: ['Kubernetes', 'Payment Service'] },
    { severity: 'medium', title: 'SSL certificate expiring in 7 days', time: '1 hour ago', affected: ['api.example.com', 'SSL'] },
    { severity: 'low', title: 'Disk space below 20% on storage-01', time: '3 hours ago', affected: ['File Server', 'Storage'] },
  ];

  const statusColors = {
    healthy: 'success',
    warning: 'warning',
    critical: 'critical',
    offline: 'default',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Infrastructure Command</h1>
          <p className="text-sm text-gray-400">
            Complete visibility into your entire infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Assets"
          value="5,427"
          change={23}
          trend="up"
          icon={<Server className="h-5 w-5" />}
        />
        <MetricCard
          title="Health Score"
          value="94%"
          change={2}
          trend="up"
          icon={<Activity className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="Active Alerts"
          value="12"
          change={3}
          trend="up"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Uptime"
          value="99.97%"
          change={0.02}
          trend="up"
          icon={<Clock className="h-5 w-5" />}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Infrastructure Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Infrastructure Overview</CardTitle>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-1">
                {['overview', 'map', 'list'].map((mode) => (
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {infrastructureStats.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'rounded-xl border p-4 transition-all hover:bg-gray-800/50 cursor-pointer',
                    item.status === 'critical' && 'border-red-500/30 bg-red-500/5',
                    item.status === 'warning' && 'border-yellow-500/30 bg-yellow-500/5',
                    item.status === 'healthy' && 'border-gray-800 bg-gray-900/50'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      'rounded-lg p-2',
                      item.status === 'critical' && 'bg-red-500/10',
                      item.status === 'warning' && 'bg-yellow-500/10',
                      item.status === 'healthy' && 'bg-gray-800'
                    )}>
                      {item.icon}
                    </div>
                    <StatusIndicator
                      variant="badge"
                      status={item.status as any}
                      size="sm"
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{item.count.toLocaleString()}</h3>
                  <p className="text-sm text-gray-400">{item.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.provider}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Top Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={issue.severity as any} size="sm">
                        {issue.severity}
                      </Badge>
                      <span className="text-[10px] text-gray-500">{issue.time}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white">{issue.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {issue.affected.map((item) => (
                        <Badge key={item} variant="outline" size="sm">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Eye className="h-4 w-4" />, label: 'Scan All', color: 'blue' },
                  { icon: <Shield className="h-4 w-4" />, label: 'Patch Now', color: 'green' },
                  { icon: <Lock className="h-4 w-4" />, label: 'Isolate', color: 'red' },
                  { icon: <Settings className="h-4 w-4" />, label: 'Configure', color: 'gray' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-sm font-medium transition-colors hover:bg-gray-700/50',
                      action.color === 'blue' && 'hover:border-blue-500/30 hover:text-blue-400',
                      action.color === 'green' && 'hover:border-green-500/30 hover:text-green-400',
                      action.color === 'red' && 'hover:border-red-500/30 hover:text-red-400',
                      action.color === 'gray' && 'hover:border-gray-500/30 hover:text-gray-400'
                    )}
                  >
                    {action.icon}
                    <span className="text-gray-300">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cloud Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Cloud Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'AWS', status: 'healthy', resources: 89 },
                  { name: 'Azure', status: 'healthy', resources: 53 },
                  { name: 'GCP', status: 'warning', resources: 21 },
                ].map((provider) => (
                  <div
                    key={provider.name}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800">
                        <Cloud className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{provider.name}</p>
                        <p className="text-xs text-gray-400">{provider.resources} resources</p>
                      </div>
                    </div>
                    <StatusIndicator variant="badge" status={provider.status as any} size="sm" />
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
