'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import { Input } from '@blacksentinel/ds/components/input';
import { StatusIndicator } from '@blacksentinel/ds/components/status-indicator';
import {
  Settings,
  Users,
  Shield,
  Key,
  Bell,
  Palette,
  Globe,
  Database,
  Lock,
  Server,
  Webhook,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdministrationPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  const users = [
    { id: 'USR-001', name: 'John Doe', email: 'john.doe@acme.com', role: 'CISO', status: 'active', lastLogin: '2 min ago', mfa: true },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane.smith@acme.com', role: 'SOC Analyst', status: 'active', lastLogin: '15 min ago', mfa: true },
    { id: 'USR-003', name: 'Bob Wilson', email: 'bob.wilson@acme.com', role: 'Security Engineer', status: 'active', lastLogin: '1 hour ago', mfa: true },
    { id: 'USR-004', name: 'Alice Brown', email: 'alice.brown@acme.com', role: 'Compliance Officer', status: 'active', lastLogin: '3 hours ago', mfa: false },
    { id: 'USR-005', name: 'Charlie Davis', email: 'charlie.davis@acme.com', role: 'Incident Responder', status: 'inactive', lastLogin: '7 days ago', mfa: true },
  ];

  const roles = [
    { name: 'CISO', users: 1, permissions: 45, description: 'Full access to all modules and settings' },
    { name: 'SOC Manager', users: 2, permissions: 38, description: 'Access to SOC operations and team management' },
    { name: 'SOC Analyst', users: 8, permissions: 25, description: 'Access to alerts, incidents, and investigations' },
    { name: 'Security Engineer', users: 4, permissions: 30, description: 'Access to infrastructure and automation' },
    { name: 'Compliance Officer', users: 2, permissions: 20, description: 'Access to compliance and reporting' },
    { name: 'Executive', users: 3, permissions: 15, description: 'Read-only access to dashboards and reports' },
    { name: 'Viewer', users: 12, permissions: 10, description: 'Read-only access to specific modules' },
  ];

  const apiKeys = [
    { id: 'KEY-001', name: 'SOC Integration', permissions: ['read', 'write'], lastUsed: '5 min ago', status: 'active' },
    { id: 'KEY-002', name: 'SIEM Connector', permissions: ['read'], lastUsed: '1 hour ago', status: 'active' },
    { id: 'KEY-003', name: 'Automation Service', permissions: ['read', 'write', 'execute'], lastUsed: '15 min ago', status: 'active' },
    { id: 'KEY-004', name: 'Reporting API', permissions: ['read'], lastUsed: '3 days ago', status: 'inactive' },
  ];

  const integrations = [
    { name: 'AWS', type: 'Cloud', status: 'connected', lastSync: '5 min ago' },
    { name: 'Azure', type: 'Cloud', status: 'connected', lastSync: '10 min ago' },
    { name: 'CrowdStrike', type: 'EDR', status: 'connected', lastSync: '2 min ago' },
    { name: 'Splunk', type: 'SIEM', status: 'connected', lastSync: '1 min ago' },
    { name: 'ServiceNow', type: 'ITSM', status: 'connected', lastSync: '15 min ago' },
    { name: 'Slack', type: 'Communication', status: 'connected', lastSync: 'Real-time' },
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield className="h-4 w-4" /> },
    { id: 'api', label: 'API Keys', icon: <Key className="h-4 w-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="text-sm text-gray-400">
            Platform settings, users, and configuration management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Organization Name</label>
                        <Input defaultValue="Acme Corporation" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Domain</label>
                        <Input defaultValue="acme.com" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Timezone</label>
                        <Input defaultValue="UTC-5 (Eastern Time)" className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Language</label>
                        <Input defaultValue="English" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Date Format</label>
                        <Input defaultValue="YYYY-MM-DD" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">Data Retention</label>
                        <Input defaultValue="90 days" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search users..." className="w-64" leftIcon={<Search className="h-4 w-4" />} />
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                          <span className="text-sm font-medium text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{user.role}</Badge>
                        <div className="flex items-center gap-1">
                          {user.mfa ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-xs text-gray-400">MFA</span>
                        </div>
                        <span className="text-xs text-gray-500">{user.lastLogin}</span>
                        <StatusIndicator variant="badge" status={user.status as any} size="sm" />
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Roles */}
          {activeTab === 'roles' && (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Roles & Permissions</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div
                      key={role.name}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                          <Shield className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{role.name}</p>
                          <p className="text-xs text-gray-400">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{role.users}</p>
                          <p className="text-[10px] text-gray-500">users</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{role.permissions}</p>
                          <p className="text-[10px] text-gray-500">permissions</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>API Keys</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{key.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Last used: {key.lastUsed}</span>
                            <span>•</span>
                            <span>Permissions: {key.permissions.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator variant="badge" status={key.status as any} size="sm" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Integrations</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Integration
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{integration.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Badge variant="outline" size="sm">{integration.type}</Badge>
                            <span>•</span>
                            <span>Last sync: {integration.lastSync}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator variant="badge" status="online" size="sm" label="Connected" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Other tabs - simplified */}
          {activeTab === 'notifications' && (
            <>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Email Notifications', description: 'Receive alerts via email', enabled: true },
                    { name: 'Push Notifications', description: 'Browser push notifications', enabled: true },
                    { name: 'Slack Integration', description: 'Send alerts to Slack channels', enabled: true },
                    { name: 'SMS Alerts', description: 'Critical alerts via SMS', enabled: false },
                    { name: 'Webhook Notifications', description: 'Custom webhook endpoints', enabled: false },
                  ].map((notification) => (
                    <div
                      key={notification.name}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{notification.name}</p>
                        <p className="text-xs text-gray-400">{notification.description}</p>
                      </div>
                      <div className={cn(
                        'h-5 w-9 rounded-full p-0.5',
                        notification.enabled ? 'bg-orange-500' : 'bg-gray-700'
                      )}>
                        <div className={cn(
                          'h-4 w-4 rounded-full bg-white transition-transform',
                          notification.enabled && 'translate-x-4'
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Require MFA', description: 'Force all users to enable MFA', enabled: true },
                    { name: 'SSO Integration', description: 'Enable Single Sign-On', enabled: true },
                    { name: 'Session Timeout', description: 'Auto-logout after inactivity', enabled: true, value: '30 minutes' },
                    { name: 'IP Whitelisting', description: 'Restrict access to specific IPs', enabled: false },
                    { name: 'Audit Logging', description: 'Log all user actions', enabled: true },
                  ].map((setting) => (
                    <div
                      key={setting.name}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{setting.name}</p>
                        <p className="text-xs text-gray-400">{setting.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {setting.value && (
                          <span className="text-sm text-gray-400">{setting.value}</span>
                        )}
                        <div className={cn(
                          'h-5 w-9 rounded-full p-0.5',
                          setting.enabled ? 'bg-orange-500' : 'bg-gray-700'
                        )}>
                          <div className={cn(
                            'h-4 w-4 rounded-full bg-white transition-transform',
                            setting.enabled && 'translate-x-4'
                          )} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Theme</label>
                    <div className="mt-2 flex gap-3">
                      {['Dark', 'Light', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                            theme === 'Dark'
                              ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                              : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          )}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Accent Color</label>
                    <div className="mt-2 flex gap-3">
                      {[
                        { name: 'Orange', color: 'bg-orange-500' },
                        { name: 'Blue', color: 'bg-blue-500' },
                        { name: 'Green', color: 'bg-green-500' },
                        { name: 'Purple', color: 'bg-purple-500' },
                      ].map((color) => (
                        <button
                          key={color.name}
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full',
                            color.color,
                            color.name === 'Orange' && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Density</label>
                    <div className="mt-2 flex gap-3">
                      {['Compact', 'Default', 'Comfortable'].map((density) => (
                        <button
                          key={density}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                            density === 'Default'
                              ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                              : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          )}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
