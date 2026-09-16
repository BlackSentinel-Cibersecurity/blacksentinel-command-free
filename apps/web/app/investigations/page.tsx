'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import { Input } from '@blacksentinel/ds/components/input';
import { StatusIndicator } from '@blacksentinel/ds/components/status-indicator';
import {
  Search,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Users,
  FileText,
  Link2,
  MessageSquare,
  Paperclip,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
  GitBranch,
  AlertTriangle,
  Shield,
  Target,
  Globe,
  Lock,
  Server,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvestigationsPage() {
  const [selectedInvestigation, setSelectedInvestigation] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState('timeline');

  const investigations = [
    {
      id: 'INV-2024-001',
      title: 'APT28 Campaign - Defense Sector',
      status: 'active',
      severity: 'critical',
      lead: 'Sarah Chen',
      team: ['John Doe', 'Mike Johnson', 'Lisa Park'],
      created: '2024-01-10',
      updated: '2024-01-15',
      alerts: 12,
      evidence: 47,
      timeline: 28,
      description: 'Investigation into coordinated APT28 targeting defense contractors through spear-phishing campaigns.',
      mitre: ['T1566.001', 'T1059.001', 'T1071.001', 'T1105'],
      iocs: [
        { type: 'IP', value: '185.100.87.42' },
        { type: 'Domain', value: 'defense-update.com' },
        { type: 'Hash', value: 'e99a18c428cb38d5f260853678922e03' },
      ],
      relatedAssets: ['server-prod-01', 'workstation-042', 'vpn-gateway'],
      timelineEvents: [
        { time: '14:32', event: 'Initial phishing email received', type: 'detection', user: 'james.wilson@acme.com' },
        { time: '14:35', event: 'User clicked malicious link', type: 'action', user: 'james.wilson@acme.com' },
        { time: '14:36', event: 'Malware payload downloaded', type: 'malware', file: 'invoice.docx.exe' },
        { time: '14:37', event: 'C2 communication established', type: 'network', ip: '185.100.87.42' },
        { time: '14:45', event: 'Lateral movement detected', type: 'lateral', target: 'server-prod-01' },
        { time: '14:52', event: 'Data exfiltration attempt', type: 'exfil', size: '2.3GB' },
        { time: '15:00', event: 'SOC alert triggered', type: 'alert', alertId: 'ALT-001' },
        { time: '15:15', event: 'Investigation opened', type: 'investigation' },
      ],
    },
    {
      id: 'INV-2024-002',
      title: 'Ransomware Attack - Finance Department',
      status: 'investigating',
      severity: 'critical',
      lead: 'John Doe',
      team: ['Mike Johnson', 'Alex Rivera'],
      created: '2024-01-12',
      updated: '2024-01-15',
      alerts: 8,
      evidence: 23,
      timeline: 15,
      description: 'Active ransomware incident affecting finance department workstations.',
      mitre: ['T1486', 'T1490', 'T1027'],
      iocs: [
        { type: 'Hash', value: 'a1b2c3d4e5f6789012345678' },
        { type: 'Domain', value: 'pay2decrypt.xyz' },
      ],
      relatedAssets: ['workstation-fin-01', 'workstation-fin-02', 'file-server-fin'],
      timelineEvents: [
        { time: '09:15', event: 'Ransomware execution detected', type: 'malware' },
        { time: '09:16', event: 'File encryption began', type: 'impact' },
        { time: '09:18', event: 'Automatic isolation triggered', type: 'containment' },
        { time: '09:20', event: 'Ransom note displayed', type: 'malware' },
      ],
    },
    {
      id: 'INV-2024-003',
      title: 'Insider Threat - Data Exfiltration',
      status: 'pending',
      severity: 'high',
      lead: 'Lisa Park',
      team: ['Sarah Chen'],
      created: '2024-01-08',
      updated: '2024-01-14',
      alerts: 5,
      evidence: 31,
      timeline: 12,
      description: 'Suspicious data transfer patterns detected from departing employee.',
      mitre: ['T1041', 'T1567'],
      iocs: [],
      relatedAssets: ['laptop-hr-15', 'cloud-storage'],
      timelineEvents: [],
    },
    {
      id: 'INV-2024-004',
      title: 'Cryptominer Deployment - Dev Environment',
      status: 'resolved',
      severity: 'medium',
      lead: 'Alex Rivera',
      team: ['Mike Johnson'],
      created: '2024-01-05',
      updated: '2024-01-10',
      alerts: 3,
      evidence: 18,
      timeline: 8,
      description: 'Cryptominer detected running on Kubernetes containers in development environment.',
      mitre: ['T1496'],
      iocs: [],
      relatedAssets: ['k8s-dev-pool', 'container-crypto'],
      timelineEvents: [],
    },
  ];

  const statusColors = {
    active: 'info',
    investigating: 'warning',
    pending: 'default',
    resolved: 'success',
    closed: 'default',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    detection: <Eye className="h-3 w-3" />,
    action: <User className="h-3 w-3" />,
    malware: <AlertTriangle className="h-3 w-3" />,
    network: <Globe className="h-3 w-3" />,
    lateral: <Server className="h-3 w-3" />,
    exfil: <Lock className="h-3 w-3" />,
    alert: <Shield className="h-3 w-3" />,
    investigation: <Search className="h-3 w-3" />,
    containment: <Shield className="h-3 w-3" />,
    impact: <AlertTriangle className="h-3 w-3" />,
  };

  const typeColors: Record<string, string> = {
    detection: 'text-blue-400 bg-blue-500/10',
    action: 'text-gray-400 bg-gray-500/10',
    malware: 'text-red-400 bg-red-500/10',
    network: 'text-purple-400 bg-purple-500/10',
    lateral: 'text-orange-400 bg-orange-500/10',
    exfil: 'text-yellow-400 bg-yellow-500/10',
    alert: 'text-red-400 bg-red-500/10',
    investigation: 'text-blue-400 bg-blue-500/10',
    containment: 'text-green-400 bg-green-500/10',
    impact: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investigations</h1>
          <p className="text-sm text-gray-400">
            Unified investigation workspace with correlated evidence and timelines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Investigation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Investigation List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search investigations..."
              leftIcon={<Search className="h-4 w-4" />}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {investigations.map((inv) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedInvestigation(inv)}
              className={cn(
                'cursor-pointer rounded-xl border p-4 transition-all',
                selectedInvestigation?.id === inv.id
                  ? 'border-orange-500/50 bg-orange-500/5'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500">{inv.id}</span>
                    <Badge variant={statusColors[inv.status as keyof typeof statusColors] as any} dot>
                      {inv.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-medium text-white">{inv.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{inv.description}</p>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {inv.alerts} alerts
                    </span>
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {inv.evidence} evidence
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {inv.timeline} events
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {inv.team.slice(0, 3).map((member, i) => (
                    <div
                      key={i}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-900 bg-gray-700"
                    >
                      <span className="text-[8px] font-medium text-white">
                        {member.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500">
                  Lead: {inv.lead}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Investigation Detail */}
        <Card className="lg:col-span-2">
          {selectedInvestigation ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{selectedInvestigation.id}</span>
                      <Badge variant={statusColors[selectedInvestigation.status as keyof typeof statusColors] as any}>
                        {selectedInvestigation.status}
                      </Badge>
                      <Badge variant={selectedInvestigation.severity === 'critical' ? 'critical' : selectedInvestigation.severity === 'high' ? 'warning' : 'info'}>
                        {selectedInvestigation.severity}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold text-white">{selectedInvestigation.title}</h2>
                    <p className="text-sm text-gray-400">{selectedInvestigation.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-800 pt-4">
                  {['timeline', 'evidence', 'iocs', 'assets', 'notes', 'team'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                        activeTab === tab
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'text-gray-400 hover:text-gray-300'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    {selectedInvestigation.timelineEvents.length > 0 ? (
                      selectedInvestigation.timelineEvents.map((event: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full',
                              typeColors[event.type] || 'text-gray-400 bg-gray-500/10'
                            )}>
                              {typeIcons[event.type] || <Clock className="h-3 w-3" />}
                            </div>
                            {index < selectedInvestigation.timelineEvents.length - 1 && (
                              <div className="mt-2 h-full w-px bg-gray-700" />
                            )}
                          </div>
                          <div className="flex-1 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-500">{event.time}</span>
                              <Badge variant="outline" size="sm">{event.type}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-white">{event.event}</p>
                            {event.user && (
                              <p className="text-xs text-gray-400">User: {event.user}</p>
                            )}
                            {event.ip && (
                              <p className="text-xs text-gray-400">IP: {event.ip}</p>
                            )}
                            {event.file && (
                              <p className="text-xs text-gray-400">File: {event.file}</p>
                            )}
                            {event.target && (
                              <p className="text-xs text-gray-400">Target: {event.target}</p>
                            )}
                            {event.size && (
                              <p className="text-xs text-gray-400">Size: {event.size}</p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex h-40 items-center justify-center text-gray-500">
                        No timeline events recorded
                      </div>
                    )}
                  </div>
                )}

                {/* Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{selectedInvestigation.evidence} evidence items</span>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" />
                        Add Evidence
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Log Snippet - Firewall', 'PCAP Capture', 'Malware Sample', 'Screenshot', 'Memory Dump', 'Email Header'].map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-white">{item}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-gray-500">Added 2 hours ago</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* IOCs Tab */}
                {activeTab === 'iocs' && (
                  <div className="space-y-3">
                    {selectedInvestigation.iocs.length > 0 ? (
                      selectedInvestigation.iocs.map((ioc: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={ioc.type === 'IP' ? 'info' : ioc.type === 'Hash' ? 'critical' : 'warning'}>
                              {ioc.type}
                            </Badge>
                            <code className="text-sm font-mono text-white">{ioc.value}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Link2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Globe className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-40 items-center justify-center text-gray-500">
                        No IOCs identified
                      </div>
                    )}
                  </div>
                )}

                {/* Assets Tab */}
                {activeTab === 'assets' && (
                  <div className="space-y-3">
                    {selectedInvestigation.relatedAssets.map((asset: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Server className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-white">{asset}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700">
                          <span className="text-[8px] font-medium text-white">SC</span>
                        </div>
                        <span className="text-xs font-medium text-white">Sarah Chen</span>
                        <span className="text-[10px] text-gray-500">2 hours ago</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">
                        Initial analysis indicates the malware uses DLL sideloading. Found similar TTPs in previous APT28 campaigns.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700">
                          <span className="text-[8px] font-medium text-white">JD</span>
                        </div>
                        <span className="text-xs font-medium text-white">John Doe</span>
                        <span className="text-[10px] text-gray-500">5 hours ago</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">
                        Coordinated with CERT-UA. They confirm similar activity targeting other defense organizations in the region.
                      </p>
                    </div>
                  </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Investigation Team</span>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" />
                        Add Member
                      </Button>
                    </div>
                    {[
                      { name: selectedInvestigation.lead, role: 'Lead Investigator', status: 'online' },
                      ...selectedInvestigation.team.filter((m: string) => m !== selectedInvestigation.lead).map((m: string) => ({
                        name: m,
                        role: 'Analyst',
                        status: Math.random() > 0.5 ? 'online' : 'offline',
                      })),
                    ].map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                            <span className="text-xs font-medium text-white">
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                        <StatusIndicator variant="dot" status={member.status as any} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center text-gray-500">
              <Search className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Select an investigation</p>
              <p className="text-sm">Choose from the list to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
