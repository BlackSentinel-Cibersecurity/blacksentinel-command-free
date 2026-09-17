'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { MetricCard } from '@blacksentinel/ds/components/metric-card';
import { Card, CardHeader, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompliancePage() {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const frameworks = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      version: '2017',
      status: 'compliant',
      score: 94,
      lastAssessment: '2024-01-10',
      nextAssessment: '2024-04-10',
      requirements: 108,
      compliant: 101,
      partial: 5,
      nonCompliant: 2,
      categories: [
        {
          name: 'Security',
          score: 96,
          requirements: [
            { id: 'CC1.1', name: 'COSO Principle 1', status: 'compliant', description: 'The entity demonstrates a commitment to integrity and ethical values' },
            { id: 'CC2.1', name: 'COSO Principle 2', status: 'compliant', description: 'The board of directors demonstrates independence from management and exercises oversight' },
            { id: 'CC3.1', name: 'COSO Principle 3', status: 'compliant', description: 'Management establishes, with board oversight, structures, reporting lines, and authorities' },
            { id: 'CC4.1', name: 'COSO Principle 4', status: 'partial', description: 'The entity demonstrates a commitment to attracting, developing, and retaining competent individuals' },
            { id: 'CC5.1', name: 'COSO Principle 5', status: 'compliant', description: 'The entity holds individuals accountable for their internal control responsibilities' },
          ],
        },
        {
          name: 'Availability',
          score: 92,
          requirements: [
            { id: 'A1.1', name: 'Processing Capacity', status: 'compliant', description: 'The entity maintains processing capacity to meet availability commitments' },
            { id: 'A1.2', name: 'Environmental Protections', status: 'compliant', description: 'The entity maintains environmental protections for availability' },
            { id: 'A1.3', name: 'Recovery Procedures', status: 'partial', description: 'The entity implements recovery procedures for availability' },
          ],
        },
        {
          name: 'Confidentiality',
          score: 95,
          requirements: [
            { id: 'C1.1', name: 'Confidentiality Commitments', status: 'compliant', description: 'The entity identifies and maintains confidential information' },
            { id: 'C1.2', name: 'Disposal of Confidential Information', status: 'compliant', description: 'The entity disposes of confidential information securely' },
          ],
        },
        {
          name: 'Processing Integrity',
          score: 93,
          requirements: [
            { id: 'PI1.1', name: 'Processing Integrity Objectives', status: 'compliant', description: 'The entity implements processing integrity objectives' },
            { id: 'PI1.2', name: 'Input Validation', status: 'compliant', description: 'The entity validates input data for processing integrity' },
          ],
        },
        {
          name: 'Privacy',
          score: 91,
          requirements: [
            { id: 'P1.1', name: 'Privacy Notice', status: 'compliant', description: 'The entity provides notice of its privacy practices' },
            { id: 'P1.2', name: 'Choice and Consent', status: 'partial', description: 'The entity obtains appropriate consent for data collection' },
          ],
        },
      ],
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      version: '2022',
      status: 'compliant',
      score: 88,
      lastAssessment: '2024-01-05',
      nextAssessment: '2024-07-05',
      requirements: 93,
      compliant: 82,
      partial: 8,
      nonCompliant: 3,
      categories: [
        {
          name: 'Organizational Controls',
          score: 90,
          requirements: [
            { id: 'A.5.1', name: 'Policies for Information Security', status: 'compliant', description: 'Information security policy and topic-specific policies shall be defined' },
            { id: 'A.5.2', name: 'Information Security Roles', status: 'compliant', description: 'Information security roles and responsibilities shall be defined' },
          ],
        },
        {
          name: 'People Controls',
          score: 87,
          requirements: [
            { id: 'A.6.1', name: 'Screening', status: 'compliant', description: 'Background verification checks shall be carried out' },
            { id: 'A.6.2', name: 'Terms and Conditions', status: 'partial', description: 'Employment contractual terms shall state responsibilities' },
          ],
        },
        {
          name: 'Physical Controls',
          score: 85,
          requirements: [
            { id: 'A.7.1', name: 'Physical Security Perimeters', status: 'compliant', description: 'Security perimeters shall be defined and used to protect areas' },
          ],
        },
        {
          name: 'Technological Controls',
          score: 89,
          requirements: [
            { id: 'A.8.1', name: 'User Endpoint Devices', status: 'compliant', description: 'Information stored on, processed by, or accessible via user endpoint devices shall be protected' },
            { id: 'A.8.2', name: 'Privileged Access Rights', status: 'partial', description: 'The allocation and use of privileged access rights shall be restricted and managed' },
          ],
        },
      ],
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      version: '2016/679',
      status: 'partial',
      score: 76,
      lastAssessment: '2024-01-08',
      nextAssessment: '2024-02-08',
      requirements: 45,
      compliant: 34,
      partial: 8,
      nonCompliant: 3,
      categories: [
        {
          name: 'Data Protection Principles',
          score: 80,
          requirements: [
            { id: 'Art.5', name: 'Principles of Processing', status: 'compliant', description: 'Personal data shall be processed lawfully, fairly, and transparently' },
            { id: 'Art.6', name: 'Lawfulness of Processing', status: 'compliant', description: 'Processing shall be lawful only if certain conditions are met' },
          ],
        },
        {
          name: 'Data Subject Rights',
          score: 75,
          requirements: [
            { id: 'Art.15', name: 'Right of Access', status: 'partial', description: 'Data subjects have the right to obtain confirmation of processing' },
            { id: 'Art.17', name: 'Right to Erasure', status: 'partial', description: 'Data subjects have the right to obtain erasure of personal data' },
          ],
        },
        {
          name: 'Security of Processing',
          score: 72,
          requirements: [
            { id: 'Art.32', name: 'Security of Processing', status: 'compliant', description: 'Appropriate technical and organizational measures shall be implemented' },
          ],
        },
      ],
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      version: '2013',
      status: 'compliant',
      score: 92,
      lastAssessment: '2024-01-12',
      nextAssessment: '2024-06-12',
      requirements: 78,
      compliant: 72,
      partial: 4,
      nonCompliant: 2,
      categories: [
        {
          name: 'Administrative Safeguards',
          score: 94,
          requirements: [
            { id: '§164.308', name: 'Administrative Controls', status: 'compliant', description: 'Implement policies and procedures to prevent, detect, and contain security incidents' },
          ],
        },
        {
          name: 'Physical Safeguards',
          score: 91,
          requirements: [
            { id: '§164.310', name: 'Physical Access Controls', status: 'compliant', description: 'Implement physical safeguards for workstations and devices' },
          ],
        },
        {
          name: 'Technical Safeguards',
          score: 90,
          requirements: [
            { id: '§164.312', name: 'Technical Controls', status: 'compliant', description: 'Implement technical safeguards for electronic protected health information' },
          ],
        },
      ],
    },
  ];

  const [selectedFramework, setSelectedFramework] = React.useState<
    (typeof frameworks)[number] | null
  >(null);

  const statusColors = {
    compliant: 'success',
    partial: 'warning',
    'non-compliant': 'critical',
    'not-assessed': 'default',
  } as const;

  const requirementStatusColors = {
    compliant: 'text-green-400 bg-green-500/10',
    partial: 'text-yellow-400 bg-yellow-500/10',
    'non-compliant': 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
          <p className="text-sm text-gray-400">
            Regulatory compliance tracking and audit management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Assessment
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Compliance"
          value="87%"
          change={3}
          trend="up"
          icon={<Shield className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          title="Frameworks Active"
          value="4"
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          title="Open Findings"
          value="12"
          change={-2}
          trend="down"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Days to Next Audit"
          value="45"
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Framework List */}
        <div className="space-y-4">
          {frameworks.map((framework) => (
            <motion.div
              key={framework.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedFramework(framework)}
              className={cn(
                'cursor-pointer rounded-xl border p-4 transition-all',
                selectedFramework?.id === framework.id
                  ? 'border-orange-500/50 bg-orange-500/5'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{framework.name}</h4>
                    <Badge variant={statusColors[framework.status as keyof typeof statusColors]} dot>
                      {framework.status}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{framework.score}%</span>
                    <span className="text-xs text-gray-400">compliance</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    framework.score >= 90 ? 'bg-green-500' :
                    framework.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  style={{ width: `${framework.score}%` }}
                />
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">Compliant</p>
                  <p className="text-sm font-medium text-green-400">{framework.compliant}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Partial</p>
                  <p className="text-sm font-medium text-yellow-400">{framework.partial}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Failed</p>
                  <p className="text-sm font-medium text-red-400">{framework.nonCompliant}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Last assessment: {framework.lastAssessment}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Framework Details */}
        <Card className="lg:col-span-2">
          {selectedFramework ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedFramework.name}</h2>
                      <Badge variant={statusColors[selectedFramework.status as keyof typeof statusColors]}>
                        {selectedFramework.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">Version {selectedFramework.version}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">{selectedFramework.score}%</p>
                      <p className="text-xs text-gray-400">Compliance Score</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Categories */}
                  {selectedFramework.categories.map((category) => (
                    <div key={category.name} className="rounded-lg border border-gray-800 bg-gray-900/50">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                        className="flex w-full items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          {expandedCategory === category.name ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-white">{category.name}</span>
                          <Badge variant={category.score >= 90 ? 'success' : category.score >= 75 ? 'warning' : 'critical'} size="sm">
                            {category.score}%
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {category.requirements.length} requirements
                        </span>
                      </button>

                      {expandedCategory === category.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="border-t border-gray-800"
                        >
                          <div className="p-4 space-y-2">
                            {category.requirements.map((req) => (
                              <div
                                key={req.id}
                                className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    'flex h-6 w-6 items-center justify-center rounded',
                                    requirementStatusColors[req.status as keyof typeof requirementStatusColors]
                                  )}>
                                    {req.status === 'compliant' && <CheckCircle className="h-3 w-3" />}
                                    {req.status === 'partial' && <AlertTriangle className="h-3 w-3" />}
                                    {req.status === 'non-compliant' && <XCircle className="h-3 w-3" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono text-gray-500">{req.id}</span>
                                      <span className="text-sm text-white">{req.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-400">{req.description}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant={req.status === 'compliant' ? 'success' : req.status === 'partial' ? 'warning' : 'critical'}
                                  size="sm"
                                >
                                  {req.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center text-gray-500">
              <Shield className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Select a framework</p>
              <p className="text-sm">Choose from the list to view compliance details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
