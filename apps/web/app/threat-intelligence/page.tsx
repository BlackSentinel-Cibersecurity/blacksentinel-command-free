'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { MetricCard } from '@blacksentinel/ds/components/metric-card';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import {
  Globe,
  Target,
  Lock,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  Shield,
  TrendingUp,
  TrendingDown,
  Map
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThreatIntelligencePage() {
  const [activeTab, setActiveTab] = React.useState('landscape');

  const threatActors = [
    {
      id: 'APT28',
      name: 'APT28 (Fancy Bear)',
      origin: 'Russia',
      targets: ['Government', 'Military', 'Defense Contractors'],
      techniques: ['T1566', 'T1059', 'T1071'],
      confidence: 'High',
      activity: 'Active',
      lastSeen: '2024-01-15',
    },
    {
      id: 'APT41',
      name: 'APT41 (Winnti)',
      origin: 'China',
      targets: ['Technology', 'Healthcare', 'Telecommunications'],
      techniques: ['T1190', 'T1133', 'T1027'],
      confidence: 'High',
      activity: 'Active',
      lastSeen: '2024-01-14',
    },
    {
      id: 'Lazarus',
      name: 'Lazarus Group',
      origin: 'North Korea',
      targets: ['Financial', 'Cryptocurrency', 'Technology'],
      techniques: ['T1566', 'T1204', 'T1055'],
      confidence: 'Medium',
      activity: 'Active',
      lastSeen: '2024-01-13',
    },
  ];

  const campaigns = [
    {
      id: 'CAM-001',
      name: 'Operation Shadow Strike',
      status: 'Active',
      severity: 'Critical',
      targets: ['Financial Sector', 'Government'],
      iocs: 147,
      lastUpdated: '2024-01-15',
    },
    {
      id: 'CAM-002',
      name: 'Silent Harvest',
      status: 'Monitoring',
      severity: 'High',
      targets: ['Healthcare', 'Technology'],
      iocs: 89,
      lastUpdated: '2024-01-14',
    },
    {
      id: 'CAM-003',
      name: 'Dark Tide',
      status: 'Contained',
      severity: 'Medium',
      targets: ['Retail', 'E-commerce'],
      iocs: 56,
      lastUpdated: '2024-01-12',
    },
  ];

  const iocs = [
    { type: 'IP Address', value: '192.168.1.100', severity: 'Critical', confidence: 'High', firstSeen: '2024-01-15' },
    { type: 'Domain', value: 'malicious-domain.com', severity: 'High', confidence: 'High', firstSeen: '2024-01-14' },
    { type: 'File Hash', value: 'a1b2c3d4e5f6...', severity: 'Critical', confidence: 'Medium', firstSeen: '2024-01-13' },
    { type: 'URL', value: 'http://phishing-site.com/login', severity: 'High', confidence: 'High', firstSeen: '2024-01-12' },
  ];

  const severityColors = {
    Critical: 'critical',
    High: 'warning',
    Medium: 'info',
    Low: 'default',
  } as const;

  const statusColors = {
    Active: 'critical',
    Monitoring: 'warning',
    Contained: 'success',
  } as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Intelligence</h1>
          <p className="text-sm text-gray-400">
            Global threat landscape monitoring and intelligence analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Intel
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Threat Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Active Threat Actors"
          value="23"
          change={3}
          trend="up"
          icon={<Target className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Active Campaigns"
          value="7"
          change={1}
          trend="up"
          icon={<Eye className="h-5 w-5" />}
          variant="critical"
        />
        <MetricCard
          title="IOCs Tracked"
          value="12,456"
          change={234}
          trend="up"
          icon={<Lock className="h-5 w-5" />}
        />
        <MetricCard
          title="Threat Feeds"
          value="47"
          icon={<Globe className="h-5 w-5" />}
        />
        <MetricCard
          title="Confidence Score"
          value="89%"
          change={2}
          trend="up"
          icon={<Shield className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
        {[
          { id: 'landscape', label: 'Threat Landscape' },
          { id: 'actors', label: 'Threat Actors' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'ioc', label: 'IOC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'landscape' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* World Map */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Global Threat Map</CardTitle>
                <Badge variant="info">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 rounded-xl border border-gray-800 bg-gray-900/50">
                {/* Simulated World Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="mx-auto h-16 w-16 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-400">Interactive World Map</p>
                    <p className="text-xs text-gray-500">Threat activity visualization</p>
                  </div>
                </div>

                {/* Threat Indicators */}
                <div className="absolute left-1/4 top-1/3">
                  <div className="relative">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-red-500" />
                    <div className="absolute -left-1 -top-1 h-6 w-6 animate-ping rounded-full bg-red-500/30" />
                  </div>
                  <p className="mt-1 text-[10px] text-red-400">Russia</p>
                </div>

                <div className="absolute left-2/3 top-1/4">
                  <div className="relative">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-orange-500" />
                    <div className="absolute -left-1 -top-1 h-6 w-6 animate-ping rounded-full bg-orange-500/30" />
                  </div>
                  <p className="mt-1 text-[10px] text-orange-400">China</p>
                </div>

                <div className="absolute left-1/2 top-1/2">
                  <div className="relative">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-yellow-500" />
                    <div className="absolute -left-1 -top-1 h-6 w-6 animate-ping rounded-full bg-yellow-500/30" />
                  </div>
                  <p className="mt-1 text-[10px] text-yellow-400">North Korea</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { trend: 'Ransomware', change: 23, direction: 'up', severity: 'critical' },
                  { trend: 'Phishing', change: 15, direction: 'up', severity: 'high' },
                  { trend: 'Supply Chain', change: 8, direction: 'up', severity: 'high' },
                  { trend: 'Zero-Day', change: 3, direction: 'up', severity: 'critical' },
                  { trend: 'Insider Threat', change: -5, direction: 'down', severity: 'medium' },
                ].map((item) => (
                  <div
                    key={item.trend}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        item.severity === 'critical' && 'bg-red-500',
                        item.severity === 'high' && 'bg-orange-500',
                        item.severity === 'medium' && 'bg-yellow-500'
                      )} />
                      <span className="text-sm font-medium text-white">{item.trend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        item.direction === 'up' ? 'text-red-400' : 'text-green-400'
                      )}>
                        {item.direction === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'actors' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Threat Actors</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatActors.map((actor) => (
                <motion.div
                  key={actor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white">{actor.name}</h4>
                        <Badge variant={statusColors[actor.activity as keyof typeof statusColors]} dot>
                          {actor.activity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Origin: {actor.origin}</span>
                        <span>Confidence: {actor.confidence}</span>
                        <span>Last Seen: {actor.lastSeen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Targets:</span>
                        {actor.targets.map((target) => (
                          <Badge key={target} variant="outline" size="sm">
                            {target}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">MITRE:</span>
                        {actor.techniques.map((technique) => (
                          <code key={technique} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-orange-400">
                            {technique}
                          </code>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'campaigns' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Campaigns</CardTitle>
              <Button variant="outline" size="sm">
                <Target className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">{campaign.id}</span>
                        <Badge variant={statusColors[campaign.status as keyof typeof statusColors]}>
                          {campaign.status}
                        </Badge>
                        <Badge variant={severityColors[campaign.severity as keyof typeof severityColors]}>
                          {campaign.severity}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium text-white">{campaign.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>IOCs: {campaign.iocs}</span>
                        <span>Last Updated: {campaign.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Targets:</span>
                        {campaign.targets.map((target) => (
                          <Badge key={target} variant="outline" size="sm">
                            {target}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ioc' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Indicators of Compromise</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Add IOC
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {iocs.map((ioc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={severityColors[ioc.severity as keyof typeof severityColors]}>
                      {ioc.severity}
                    </Badge>
                    <div>
                      <p className="text-xs text-gray-400">{ioc.type}</p>
                      <code className="text-sm font-mono text-white">{ioc.value}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>Confidence: {ioc.confidence}</span>
                    <span>First Seen: {ioc.firstSeen}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
