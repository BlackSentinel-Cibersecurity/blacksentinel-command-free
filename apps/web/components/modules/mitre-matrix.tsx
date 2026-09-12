'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import {
  Shield,
  AlertTriangle,
  Eye,
  Info,
  ExternalLink,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================================================
// MITRE ATT&CK Types
// ============================================================================

export interface MITRETactic {
  id: string;
  name: string;
  shortName: string;
  description: string;
  techniques: MITREETechnique[];
}

export interface MITREETechnique {
  id: string;
  name: string;
  description: string;
  tacticIds: string[];
  detection?: string;
  mitigation?: string;
  platforms?: string[];
  dataSources?: string[];
  isSubtechnique?: boolean;
  parentTechnique?: string;
  detections: number;
  alerts: number;
  risk: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

// ============================================================================
// MITRE ATT&CK Data
// ============================================================================

export const MITRE_TACTICS: MITRETactic[] = [
  {
    id: 'TA0043',
    name: 'Reconnaissance',
    shortName: 'Reconnaissance',
    description: 'The adversary is trying to gather information they can use to plan future operations.',
    techniques: [
      { id: 'T1595', name: 'Active Scanning', description: 'Adversaries may execute active reconnaissance scans', tacticIds: ['TA0043'], detections: 45, alerts: 12, risk: 'medium' },
      { id: 'T1592', name: 'Gather Victim Host Information', description: 'Adversaries may gather information about the victim\'s hosts', tacticIds: ['TA0043'], detections: 23, alerts: 5, risk: 'low' },
      { id: 'T1589', name: 'Gather Victim Identity Information', description: 'Adversaries may gather information about the victim\'s identity', tacticIds: ['TA0043'], detections: 34, alerts: 8, risk: 'medium' },
    ],
  },
  {
    id: 'TA0042',
    name: 'Resource Development',
    shortName: 'Resource Development',
    description: 'The adversary is trying to establish resources they can use to support operations.',
    techniques: [
      { id: 'T1583', name: 'Acquire Infrastructure', description: 'Adversaries may buy, lease, or rent infrastructure', tacticIds: ['TA0042'], detections: 12, alerts: 3, risk: 'low' },
      { id: 'T1587', name: 'Develop Capabilities', description: 'Adversaries may build capabilities that can be used during targeting', tacticIds: ['TA0042'], detections: 8, alerts: 2, risk: 'low' },
    ],
  },
  {
    id: 'TA0001',
    name: 'Initial Access',
    shortName: 'Initial Access',
    description: 'The adversary is trying to gain a foothold into your environment.',
    techniques: [
      { id: 'T1566', name: 'Phishing', description: 'Adversaries may send phishing messages to gain access to victim systems', tacticIds: ['TA0001'], detections: 156, alerts: 45, risk: 'critical' },
      { id: 'T1190', name: 'Exploit Public-Facing Application', description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program', tacticIds: ['TA0001'], detections: 89, alerts: 23, risk: 'high' },
      { id: 'T1133', name: 'External Remote Services', description: 'Adversaries may leverage external-facing remote services to initially access and/or persist within a network', tacticIds: ['TA0001'], detections: 67, alerts: 18, risk: 'high' },
      { id: 'T1078', name: 'Valid Accounts', description: 'Adversaries may obtain and abuse credentials of existing accounts', tacticIds: ['TA0001'], detections: 45, alerts: 12, risk: 'high' },
    ],
  },
  {
    id: 'TA0002',
    name: 'Execution',
    shortName: 'Execution',
    description: 'The adversary is trying to run malicious code.',
    techniques: [
      { id: 'T1059', name: 'Command and Scripting Interpreter', description: 'Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries', tacticIds: ['TA0002'], detections: 234, alerts: 67, risk: 'critical' },
      { id: 'T1204', name: 'User Execution', description: 'An adversary may rely upon specific actions by a user in order to gain execution', tacticIds: ['TA0002'], detections: 178, alerts: 52, risk: 'high' },
      { id: 'T1053', name: 'Scheduled Task/Job', description: 'Adversaries may abuse task scheduling functionality to facilitate initial or recurring execution of malicious code', tacticIds: ['TA0002'], detections: 56, alerts: 15, risk: 'medium' },
    ],
  },
  {
    id: 'TA0003',
    name: 'Persistence',
    shortName: 'Persistence',
    description: 'The adversary is trying to maintain their foothold.',
    techniques: [
      { id: 'T1136', name: 'Create Account', description: 'Adversaries may create an account to maintain access to victim systems', tacticIds: ['TA0003'], detections: 34, alerts: 8, risk: 'medium' },
      { id: 'T1547', name: 'Boot or Logon Autostart Execution', description: 'Adversaries may configure system settings to automatically execute a program during system boot or logon', tacticIds: ['TA0003'], detections: 89, alerts: 24, risk: 'high' },
      { id: 'T1543', name: 'Create or Modify System Process', description: 'Adversaries may create or modify system-level processes to repeatedly execute malicious payloads as part of persistence', tacticIds: ['TA0003'], detections: 45, alerts: 12, risk: 'medium' },
    ],
  },
  {
    id: 'TA0004',
    name: 'Privilege Escalation',
    shortName: 'Privilege Escalation',
    description: 'The adversary is trying to gain higher-level permissions.',
    techniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation', description: 'Adversaries may exploit software vulnerabilities to elevate privileges', tacticIds: ['TA0004'], detections: 67, alerts: 19, risk: 'high' },
      { id: 'T1548', name: 'Abuse Elevation Control Mechanism', description: 'Adversaries may circumvent mechanisms designed to control elevated privileges to gain higher-level permissions', tacticIds: ['TA0004'], detections: 45, alerts: 11, risk: 'medium' },
    ],
  },
  {
    id: 'TA0005',
    name: 'Defense Evasion',
    shortName: 'Defense Evasion',
    description: 'The adversary is trying to avoid being detected.',
    techniques: [
      { id: 'T1027', name: 'Obfuscated Files or Information', description: 'Adversaries may attempt to make an executable or file difficult to discover or analyze by encrypting, encoding, or otherwise obfuscating its contents', tacticIds: ['TA0005'], detections: 189, alerts: 54, risk: 'high' },
      { id: 'T1070', name: 'Indicator Removal', description: 'Adversaries may delete or modify artifacts generated within systems to remove evidence of their presence', tacticIds: ['TA0005'], detections: 78, alerts: 21, risk: 'high' },
      { id: 'T1036', name: 'Masquerading', description: 'Adversaries may attempt to manipulate features of their samples to make them appear legitimate or benign', tacticIds: ['TA0005'], detections: 123, alerts: 35, risk: 'medium' },
    ],
  },
  {
    id: 'TA0006',
    name: 'Credential Access',
    shortName: 'Credential Access',
    description: 'The adversary is trying to steal account names and passwords.',
    techniques: [
      { id: 'T1110', name: 'Brute Force', description: 'Adversaries may use brute force techniques to gain access to accounts', tacticIds: ['TA0006'], detections: 234, alerts: 67, risk: 'critical' },
      { id: 'T1003', name: 'OS Credential Dumping', description: 'Adversaries may attempt to dump credentials to obtain account login and credential material', tacticIds: ['TA0006'], detections: 56, alerts: 16, risk: 'high' },
      { id: 'T1557', name: 'Adversary-in-the-Middle', description: 'Adversaries may attempt to position themselves between two or more networked devices to support follow-on behaviors', tacticIds: ['TA0006'], detections: 34, alerts: 9, risk: 'medium' },
    ],
  },
  {
    id: 'TA0007',
    name: 'Discovery',
    shortName: 'Discovery',
    description: 'The adversary is trying to figure out your environment.',
    techniques: [
      { id: 'T1087', name: 'Account Discovery', description: 'Adversaries may attempt to get a listing of accounts on a system or within an environment', tacticIds: ['TA0007'], detections: 89, alerts: 24, risk: 'medium' },
      { id: 'T1083', name: 'File and Directory Discovery', description: 'Adversaries may enumerate files and directories or may search in specific locations of a host or network share for certain information within a file system', tacticIds: ['TA0007'], detections: 123, alerts: 34, risk: 'medium' },
    ],
  },
  {
    id: 'TA0008',
    name: 'Lateral Movement',
    shortName: 'Lateral Movement',
    description: 'The adversary is trying to move through your environment.',
    techniques: [
      { id: 'T1021', name: 'Remote Services', description: 'Adversaries may use Valid Accounts to log into a service specifically designed to accept remote connections', tacticIds: ['TA0008'], detections: 156, alerts: 44, risk: 'high' },
      { id: 'T1570', name: 'Lateral Tool Transfer', description: 'Adversaries may transfer tools or other files between systems in a compromised environment', tacticIds: ['TA0008'], detections: 67, alerts: 18, risk: 'high' },
    ],
  },
  {
    id: 'TA0009',
    name: 'Collection',
    shortName: 'Collection',
    description: 'The adversary is trying to gather data of interest to their goal.',
    techniques: [
      { id: 'T1005', name: 'Data from Local System', description: 'Adversaries may search local system sources, such as file systems and configuration files, to find files of interest and sensitive data prior to Exfiltration', tacticIds: ['TA0009'], detections: 89, alerts: 24, risk: 'medium' },
      { id: 'T1114', name: 'Email Collection', description: 'Adversaries may target user email to collect sensitive information', tacticIds: ['TA0009'], detections: 45, alerts: 12, risk: 'medium' },
    ],
  },
  {
    id: 'TA0011',
    name: 'Command and Control',
    shortName: 'C2',
    description: 'The adversary is trying to communicate with compromised systems to control them.',
    techniques: [
      { id: 'T1071', name: 'Application Layer Protocol', description: 'Adversaries may communicate using OSI application layer protocols to avoid detection/network filtering by blending in with existing traffic', tacticIds: ['TA0011'], detections: 234, alerts: 67, risk: 'critical' },
      { id: 'T1105', name: 'Ingress Tool Transfer', description: 'Adversaries may transfer tools or other files from an external system into a compromised environment', tacticIds: ['TA0011'], detections: 123, alerts: 34, risk: 'high' },
    ],
  },
  {
    id: 'TA0010',
    name: 'Exfiltration',
    shortName: 'Exfiltration',
    description: 'The adversary is trying to steal data.',
    techniques: [
      { id: 'T1041', name: 'Exfiltration Over C2 Channel', description: 'Adversaries may steal data by exfiltrating it over an existing command and control channel', tacticIds: ['TA0010'], detections: 67, alerts: 18, risk: 'high' },
      { id: 'T1567', name: 'Exfiltration Over Web Service', description: 'Adversaries may use an existing, legitimate external Web service to exfiltrate data rather than their primary command and control channel', tacticIds: ['TA0010'], detections: 45, alerts: 12, risk: 'high' },
    ],
  },
  {
    id: 'TA0040',
    name: 'Impact',
    shortName: 'Impact',
    description: 'The adversary is trying to manipulate, interrupt, or destroy your systems and data.',
    techniques: [
      { id: 'T1486', name: 'Data Encrypted for Impact', description: 'Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability to system and network resources', tacticIds: ['TA0040'], detections: 34, alerts: 9, risk: 'critical' },
      { id: 'T1490', name: 'Inhibit System Recovery', description: 'Adversaries may delete or remove built-in data and turn off services designed to aid in the recovery of a corrupted system to prevent recovery', tacticIds: ['TA0040'], detections: 23, alerts: 6, risk: 'critical' },
      { id: 'T1499', name: 'Endpoint Denial of Service', description: 'Adversaries may perform Endpoint Denial of Service (DoS) attacks to degrade or block the availability of targeted resources to users', tacticIds: ['TA0040'], detections: 56, alerts: 15, risk: 'high' },
    ],
  },
];

// ============================================================================
// MITRE ATT&CK Matrix Component
// ============================================================================

export interface MITREMatrixProps {
  detections?: Record<string, number>;
  alerts?: Record<string, number>;
  onTechniqueClick?: (technique: MITREETechnique) => void;
  selectedTechniques?: string[];
  highlightRisk?: boolean;
}

export function MITREMatrix({
  detections = {},
  alerts = {},
  onTechniqueClick,
  selectedTechniques = [],
  highlightRisk = true,
}: MITREMatrixProps) {
  const [hoveredTechnique, setHoveredTechnique] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'detected' | 'alerted' | 'risk'>('all');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getDetectionCount = (techniqueId: string) => {
    return detections[techniqueId] || 0;
  };

  const getAlertCount = (techniqueId: string) => {
    return alerts[techniqueId] || 0;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">MITRE ATT&CK Matrix</h3>
          <Badge variant="outline">
            {MITRE_TACTICS.length} Tactics
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800/50 p-1">
            {['all', 'detected', 'alerted', 'risk'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  'rounded-md px-2 py-1 text-[10px] font-medium capitalize transition-colors',
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-3 w-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-red-500" />
          <span className="text-gray-400">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-orange-500" />
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-yellow-500" />
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-green-500" />
          <span className="text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded bg-gray-500" />
          <span className="text-gray-400">None</span>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: `${MITRE_TACTICS.length * 200}px` }}>
          {MITRE_TACTICS.map((tactic) => (
            <div
              key={tactic.id}
              className="flex-1 min-w-[180px]"
            >
              {/* Tactic Header */}
              <div className="mb-2 rounded-t-lg bg-gray-800 p-2">
                <p className="text-xs font-bold text-white">{tactic.shortName}</p>
                <p className="text-[10px] text-gray-500">{tactic.id}</p>
              </div>

              {/* Techniques */}
              <div className="space-y-1">
                {tactic.techniques.map((technique) => {
                  const detectionCount = getDetectionCount(technique.id);
                  const alertCount = getAlertCount(technique.id);
                  const isSelected = selectedTechniques.includes(technique.id);
                  const isHovered = hoveredTechnique === technique.id;

                  const shouldShow = filter === 'all' ||
                    (filter === 'detected' && detectionCount > 0) ||
                    (filter === 'alerted' && alertCount > 0) ||
                    (filter === 'risk' && technique.risk !== 'none');

                  if (!shouldShow) return null;

                  return (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onMouseEnter={() => setHoveredTechnique(technique.id)}
                      onMouseLeave={() => setHoveredTechnique(null)}
                      onClick={() => onTechniqueClick?.(technique)}
                      className={cn(
                        'cursor-pointer rounded border p-2 transition-all',
                        highlightRisk ? getRiskColor(technique.risk) : 'border-gray-700 bg-gray-800/50',
                        isSelected && 'ring-2 ring-orange-500',
                        isHovered && 'scale-[1.02]'
                      )}
                    >
                      <p className="text-[11px] font-medium text-white">{technique.name}</p>
                      <p className="text-[10px] text-gray-500">{technique.id}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        {detectionCount > 0 && (
                          <span className="text-green-400">{detectionCount} detections</span>
                        )}
                        {alertCount > 0 && (
                          <span className="text-red-400">{alertCount} alerts</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technique Details Tooltip */}
      {hoveredTechnique && (
        <div className="fixed bottom-4 left-4 z-50 w-80 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-xl">
          {(() => {
            const technique = MITRE_TACTICS
              .flatMap(t => t.techniques)
              .find(t => t.id === hoveredTechnique);
            if (!technique) return null;

            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{technique.name}</h4>
                    <p className="text-xs text-gray-500">{technique.id}</p>
                  </div>
                  <Badge variant={technique.risk as any}>
                    {technique.risk}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-gray-400">{technique.description}</p>
                {technique.detection && (
                  <div className="mt-2">
                    <p className="text-[10px] font-medium text-gray-500">Detection:</p>
                    <p className="text-xs text-gray-400">{technique.detection}</p>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    MITRE
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default MITREMatrix;
