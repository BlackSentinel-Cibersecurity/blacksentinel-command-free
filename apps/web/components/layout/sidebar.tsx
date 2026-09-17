'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import {
  LayoutDashboard,
  Shield,
  Activity,
  Globe,
  Server,
  Box,
  Search,
  Settings,
  Bell,
  Lock,
  ChevronDown,
  Menu,
  X,
  Target,
  Eye,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/dashboard',
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: <Activity className="h-4 w-4" />,
    path: '/operations',
    children: [
      { id: 'soc', label: 'SOC Center', icon: <Shield className="h-4 w-4" />, path: '/operations/soc' },
      { id: 'incidents', label: 'Incidents', icon: <Target className="h-4 w-4" />, path: '/operations/incidents', badge: 12 },
      { id: 'alerts', label: 'Alerts', icon: <Bell className="h-4 w-4" />, path: '/operations/alerts', badge: 47 },
    ],
  },
  {
    id: 'threat-intelligence',
    label: 'Threat Intel',
    icon: <Eye className="h-4 w-4" />,
    path: '/threat-intelligence',
    children: [
      { id: 'threat-landscape', label: 'Landscape', icon: <Globe className="h-4 w-4" />, path: '/threat-intelligence/landscape' },
      { id: 'campaigns', label: 'Campaigns', icon: <Target className="h-4 w-4" />, path: '/threat-intelligence/campaigns' },
      { id: 'ioc', label: 'IOC', icon: <Lock className="h-4 w-4" />, path: '/threat-intelligence/ioc' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: <Server className="h-4 w-4" />,
    path: '/infrastructure',
    children: [
      { id: 'servers', label: 'Servers', icon: <Server className="h-4 w-4" />, path: '/infrastructure/servers' },
      { id: 'cloud', label: 'Cloud', icon: <Database className="h-4 w-4" />, path: '/infrastructure/cloud' },
      { id: 'containers', label: 'Containers', icon: <Box className="h-4 w-4" />, path: '/infrastructure/containers' },
      { id: 'network', label: 'Network', icon: <Globe className="h-4 w-4" />, path: '/infrastructure/network' },
    ],
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: <Box className="h-4 w-4" />,
    path: '/assets',
  },
  {
    id: 'investigations',
    label: 'Investigations',
    icon: <Search className="h-4 w-4" />,
    path: '/investigations',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <Lock className="h-4 w-4" />,
    path: '/compliance',
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: <Settings className="h-4 w-4" />,
    path: '/administration',
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['operations']);
  const [activeItem, setActiveItem] = React.useState('/dashboard');

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl',
        'flex flex-col'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-2"
        >
          <img
            src="/icons/logo.png"
            alt="BlackSentinel"
            className="h-9 w-9 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                <span className="text-white">BLACK</span>
                <span className="text-orange-500">SENTINEL</span>
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] text-gray-400">COMMAND</span>
            </div>
          )}
        </motion.div>
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      expandedItems.includes(item.id)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    )}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            expandedItems.includes(item.id) && 'rotate-180'
                          )}
                        />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.id) && !collapsed && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <a
                              href={child.path}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveItem(child.path);
                              }}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
                                activeItem === child.path
                                  ? 'bg-orange-500/10 text-orange-400'
                                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                              )}
                            >
                              {child.icon}
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="ml-auto rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-300">
                                  {child.badge}
                                </span>
                              )}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item.path);
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    activeItem === item.path
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-300">
                      {item.badge}
                    </span>
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
            <span className="text-xs font-bold text-white">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">CISO</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
