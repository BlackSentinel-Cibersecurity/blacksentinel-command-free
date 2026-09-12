'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { MetricCard } from '@blacksentinel/ds/components/metric-card';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { StatusIndicator } from '@blacksentinel/ds/components/status-indicator';
import { 
  Shield, 
  AlertTriangle, 
  Target, 
  Activity, 
  Users, 
  Server, 
  Globe, 
  Lock, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Command Center</h1>
          <p className="text-sm text-gray-400">
            Real-time security posture and risk intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator variant="pulse" status="online" label="All Systems Operational" />
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs text-gray-400">
            Last updated: 2 min ago
          </div>
        </div>
      </div>

      {/* Global Security Score */}
      <Card variant="glow">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-400">Global Security Score</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-orange-400">87</span>
              <span className="text-sm text-gray-400">/ 100</span>
              <Badge variant="success" dot>+3 this week</Badge>
            </div>
            <p className="text-sm text-gray-400">
              Your organization's security posture is <span className="font-medium text-green-400">Strong</span>
            </p>
          </div>
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#232323"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Business Risk Score"
          value="23"
          change={-12}
          trend="down"
          changeLabel="vs last month"
          icon={<Target className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="Active Incidents"
          value="7"
          change={2}
          trend="up"
          changeLabel="vs yesterday"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="critical"
        />
        <MetricCard
          title="Attack Surface"
          value="1,247"
          change={-5}
          trend="down"
          changeLabel="exposed assets"
          icon={<Globe className="h-5 w-5" />}
        />
        <MetricCard
          title="Automation Rate"
          value="78%"
          change={15}
          trend="up"
          changeLabel="resolved automatically"
          icon={<Zap className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Threat Activity Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Threat Activity Timeline</CardTitle>
              <Badge variant="info">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: '14:32',
                  type: 'critical',
                  title: 'Ransomware Activity Detected',
                  description: 'Suspicious file encryption behavior on server-prod-01',
                  severity: 'Critical',
                  status: 'Investigating',
                },
                {
                  time: '14:15',
                  type: 'warning',
                  title: 'Brute Force Attack',
                  description: 'Multiple failed login attempts from IP 192.168.1.100',
                  severity: 'High',
                  status: 'Contained',
                },
                {
                  time: '13:45',
                  type: 'info',
                  title: 'Certificate Expiry Warning',
                  description: 'SSL certificate for api.example.com expires in 7 days',
                  severity: 'Medium',
                  status: 'Pending',
                },
                {
                  time: '12:30',
                  type: 'success',
                  title: 'Incident Resolved',
                  description: 'Malware infection on workstation-042 successfully remediated',
                  severity: 'Low',
                  status: 'Resolved',
                },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-800/50"
                >
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-3 w-3 rounded-full',
                      event.type === 'critical' && 'bg-red-500',
                      event.type === 'warning' && 'bg-yellow-500',
                      event.type === 'info' && 'bg-blue-500',
                      event.type === 'success' && 'bg-green-500'
                    )} />
                    {index < 3 && <div className="mt-2 h-full w-px bg-gray-700" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{event.time}</span>
                      <Badge variant={
                        event.type === 'critical' ? 'critical' :
                        event.type === 'warning' ? 'warning' :
                        event.type === 'info' ? 'info' : 'success'
                      }>
                        {event.severity}
                      </Badge>
                    </div>
                    <h4 className="mt-1 text-sm font-medium text-white">{event.title}</h4>
                    <p className="text-xs text-gray-400">{event.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">Status:</span>
                      <Badge variant="outline" size="sm">{event.status}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* Identity Risk */}
          <Card>
            <CardHeader>
              <CardTitle>Identity Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Doe', role: 'CISO', risk: 'Low', score: 12 },
                  { name: 'Jane Smith', role: 'Admin', risk: 'Medium', score: 45 },
                  { name: 'Bob Wilson', role: 'Developer', risk: 'High', score: 78 },
                ].map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                        <span className="text-xs font-medium text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        user.risk === 'Low' ? 'success' :
                        user.risk === 'Medium' ? 'warning' : 'critical'
                      }
                      size="sm"
                    >
                      {user.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { framework: 'SOC 2', score: 94, status: 'Compliant' },
                  { framework: 'ISO 27001', score: 88, status: 'Compliant' },
                  { framework: 'GDPR', score: 76, status: 'In Progress' },
                  { framework: 'HIPAA', score: 92, status: 'Compliant' },
                ].map((item) => (
                  <div key={item.framework} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.framework}</span>
                      <span className="text-sm font-medium text-white">{item.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          item.score >= 90 ? 'bg-green-500' :
                          item.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
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
                  { icon: <Shield className="h-4 w-4" />, label: 'Run Playbook', color: 'orange' },
                  { icon: <Lock className="h-4 w-4" />, label: 'Block IOC', color: 'red' },
                  { icon: <Users className="h-4 w-4" />, label: 'Isolate User', color: 'yellow' },
                  { icon: <Server className="h-4 w-4" />, label: 'Isolate Host', color: 'blue' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-sm font-medium transition-colors hover:bg-gray-700/50',
                      action.color === 'orange' && 'hover:border-orange-500/30 hover:text-orange-400',
                      action.color === 'red' && 'hover:border-red-500/30 hover:text-red-400',
                      action.color === 'yellow' && 'hover:border-yellow-500/30 hover:text-yellow-400',
                      action.color === 'blue' && 'hover:border-blue-500/30 hover:text-blue-400'
                    )}
                  >
                    {action.icon}
                    <span className="text-gray-300">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Infrastructure Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Infrastructure Health</CardTitle>
              <Badge variant="success" dot>All Systems Operational</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Cloud Servers', count: 142, status: 'online', health: 99.9 },
                { name: 'Containers', count: 1247, status: 'online', health: 99.7 },
                { name: 'Endpoints', count: 3456, status: 'online', health: 98.5 },
                { name: 'Network Devices', count: 89, status: 'online', health: 99.8 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{item.name}</span>
                    <StatusIndicator variant="dot" status={item.status as any} size="sm" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white">{item.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.health}% uptime</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card variant="glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-orange-400" />
              <CardTitle>AI Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  priority: 'Critical',
                  title: 'Isolate server-prod-01 immediately',
                  reason: 'Detected ransomware encryption activity',
                  impact: 'Prevents potential data loss',
                },
                {
                  priority: 'High',
                  title: 'Rotate API keys for service-account-01',
                  reason: 'Key exposed in public repository',
                  impact: 'Eliminates unauthorized access risk',
                },
                {
                  priority: 'Medium',
                  title: 'Update firewall rules for subnet 10.0.0.0/16',
                  reason: 'New CVE-2024-1234 affects exposed services',
                  impact: 'Reduces attack surface by 15%',
                },
              ].map((rec, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-colors hover:border-orange-500/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        rec.priority === 'Critical' ? 'critical' :
                        rec.priority === 'High' ? 'warning' : 'info'
                      }
                      size="sm"
                    >
                      {rec.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">AI Recommendation</span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-white">{rec.title}</h4>
                  <p className="text-xs text-gray-400">{rec.reason}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Impact:</span>
                    <span className="text-[10px] text-green-400">{rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
