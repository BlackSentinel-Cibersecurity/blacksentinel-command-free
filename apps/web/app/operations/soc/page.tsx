'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { MetricCard } from '@blacksentinel/ds/components/metric-card';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import {
  AlertTriangle,
  Target,
  Users,
  Clock,
  Eye,
  Play,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Brain,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SOCPage() {
  const alerts = [
    {
      id: 'ALT-001',
      title: 'Ransomware Activity Detected',
      source: 'Endpoint Detection',
      severity: 'Critical',
      status: 'Investigating',
      timestamp: '2024-01-15 14:32:00',
      assignee: 'John Doe',
      affectedAssets: ['server-prod-01', 'workstation-042'],
      mitre: 'T1486',
      ioc: ['192.168.1.100', 'malware.exe'],
    },
    {
      id: 'ALT-002',
      title: 'Brute Force Attack Attempt',
      source: 'Network IDS',
      severity: 'High',
      status: 'Contained',
      timestamp: '2024-01-15 14:15:00',
      assignee: 'Jane Smith',
      affectedAssets: ['auth-server-01'],
      mitre: 'T1110',
      ioc: ['203.0.113.50'],
    },
    {
      id: 'ALT-003',
      title: 'Suspicious PowerShell Execution',
      source: 'EDR',
      severity: 'Medium',
      status: 'Pending',
      timestamp: '2024-01-15 13:45:00',
      assignee: 'Bob Wilson',
      affectedAssets: ['workstation-015'],
      mitre: 'T1059.001',
      ioc: ['powershell.exe'],
    },
    {
      id: 'ALT-004',
      title: 'Data Exfiltration Attempt',
      source: 'DLP',
      severity: 'High',
      status: 'Investigating',
      timestamp: '2024-01-15 13:30:00',
      assignee: 'Alice Brown',
      affectedAssets: ['file-server-01'],
      mitre: 'T1041',
      ioc: ['external-ip.com'],
    },
    {
      id: 'ALT-005',
      title: 'Unauthorized Access Attempt',
      source: 'IAM',
      severity: 'Medium',
      status: 'Resolved',
      timestamp: '2024-01-15 12:15:00',
      assignee: 'John Doe',
      affectedAssets: ['vpn-gateway-01'],
      mitre: 'T1078',
      ioc: ['unknown-user'],
    },
  ];

  const severityColors = {
    Critical: 'critical',
    High: 'warning',
    Medium: 'info',
    Low: 'default',
  } as const;

  const statusColors = {
    Investigating: 'warning',
    Contained: 'info',
    Pending: 'default',
    Resolved: 'success',
  } as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SOC Command Center</h1>
          <p className="text-sm text-gray-400">
            Security Operations Center - Real-time threat monitoring and response
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Start Playbook
          </Button>
        </div>
      </div>

      {/* SOC Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <MetricCard
          title="Open Alerts"
          value="47"
          change={12}
          trend="up"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Critical Incidents"
          value="3"
          change={1}
          trend="up"
          icon={<Target className="h-5 w-5" />}
          variant="critical"
        />
        <MetricCard
          title="MTTD"
          value="12m"
          change={-8}
          trend="down"
          icon={<Clock className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="MTTR"
          value="45m"
          change={-15}
          trend="down"
          icon={<Zap className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="Analysts Online"
          value="8"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Automation Rate"
          value="78%"
          change={5}
          trend="up"
          icon={<Brain className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Alerts Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>Active Alerts</CardTitle>
                <div className="flex items-center gap-2">
                  {['All', 'Critical', 'High', 'Medium', 'Low'].map((filter) => (
                    <button
                      key={filter}
                      className={cn(
                        'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                        filter === 'All'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">{alert.id}</span>
                        <Badge variant={severityColors[alert.severity as keyof typeof severityColors]}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={statusColors[alert.status as keyof typeof statusColors]}>
                          {alert.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Source: {alert.source}</span>
                        <span>Assignee: {alert.assignee}</span>
                        <span>MITRE: {alert.mitre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Assets:</span>
                        {alert.affectedAssets.map((asset) => (
                          <Badge key={asset} variant="outline" size="sm">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">IOC:</span>
                        {alert.ioc.map((ioc) => (
                          <code key={ioc} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-orange-400">
                            {ioc}
                          </code>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* MITRE ATT&CK Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>MITRE ATT&CK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { tactic: 'Initial Access', techniques: 12, alerts: 3 },
                  { tactic: 'Execution', techniques: 8, alerts: 5 },
                  { tactic: 'Persistence', techniques: 6, alerts: 2 },
                  { tactic: 'Privilege Escalation', techniques: 4, alerts: 1 },
                  { tactic: 'Defense Evasion', techniques: 9, alerts: 4 },
                  { tactic: 'Credential Access', techniques: 7, alerts: 6 },
                ].map((item) => (
                  <div
                    key={item.tactic}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.tactic}</p>
                      <p className="text-xs text-gray-400">{item.techniques} techniques</p>
                    </div>
                    <Badge variant={item.alerts > 3 ? 'critical' : item.alerts > 1 ? 'warning' : 'default'}>
                      {item.alerts} alerts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Playbooks */}
          <Card>
            <CardHeader>
              <CardTitle>Active Playbooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Ransomware Response', status: 'Running', progress: 65 },
                  { name: 'Phishing Investigation', status: 'Pending', progress: 0 },
                  { name: 'Incident Containment', status: 'Completed', progress: 100 },
                ].map((playbook) => (
                  <div
                    key={playbook.name}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{playbook.name}</span>
                      <Badge
                        variant={
                          playbook.status === 'Running' ? 'info' :
                          playbook.status === 'Completed' ? 'success' : 'default'
                        }
                        size="sm"
                      >
                        {playbook.status}
                      </Badge>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          playbook.status === 'Running' ? 'bg-blue-500' :
                          playbook.status === 'Completed' ? 'bg-green-500' : 'bg-gray-600'
                        )}
                        style={{ width: `${playbook.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Investigations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'INV-001', title: 'APT28 Campaign Analysis', status: 'Active', assignee: 'John Doe' },
                  { id: 'INV-002', title: 'Data Breach Assessment', status: 'Pending', assignee: 'Jane Smith' },
                  { id: 'INV-003', title: 'Malware Reverse Engineering', status: 'Completed', assignee: 'Bob Wilson' },
                ].map((investigation) => (
                  <div
                    key={investigation.id}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-500">{investigation.id}</span>
                      <Badge
                        variant={
                          investigation.status === 'Active' ? 'info' :
                          investigation.status === 'Completed' ? 'success' : 'default'
                        }
                        size="sm"
                      >
                        {investigation.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-white">{investigation.title}</p>
                    <p className="text-xs text-gray-400">Assignee: {investigation.assignee}</p>
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
