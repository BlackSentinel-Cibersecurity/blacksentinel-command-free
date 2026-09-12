'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun, 
  Maximize2, 
  Minimize2,
  Command,
  ChevronDown,
  Globe,
  Shield,
  Activity,
  Box,
  Zap,
  Lock,
  BarChart3,
  Brain,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSearchOpen?: () => void;
  onCommandOpen?: () => void;
}

export function Header({ onSearchOpen, onCommandOpen }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const notifications = [
    {
      id: '1',
      type: 'critical',
      title: 'Critical Incident Detected',
      description: 'Ransomware activity detected on server-prod-01',
      time: '2 min ago',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Certificate Expiring',
      description: 'SSL certificate for api.example.com expires in 7 days',
      time: '15 min ago',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: '3',
      type: 'success',
      title: 'Playbook Executed',
      description: 'Incident Response Playbook IR-001 completed successfully',
      time: '1 hour ago',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  const typeColors = {
    critical: 'text-red-400 bg-red-500/10',
    warning: 'text-yellow-400 bg-yellow-500/10',
    success: 'text-green-400 bg-green-500/10',
    info: 'text-blue-400 bg-blue-500/10',
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900/80 px-4 backdrop-blur-xl">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">BlackSentinel</span>
          <span className="text-gray-600">/</span>
          <span className="font-medium text-white">Command</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex flex-1 items-center justify-center max-w-xl">
        <button
          onClick={onSearchOpen}
          className="flex w-full items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
        >
          <Search className="h-4 w-4" />
          <span>Search everything...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="rounded border border-gray-600 bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
              ⌘
            </kbd>
            <kbd className="rounded border border-gray-600 bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-300">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <button
          onClick={onCommandOpen}
          className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
        >
          <img src="/icons/logo.png" alt="" className="h-4 w-4" />
          <span>AI Command</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-700 bg-gray-800 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <button className="text-xs text-orange-400 hover:text-orange-300">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 border-b border-gray-700/50 p-4 transition-colors hover:bg-gray-700/50"
                    >
                      <div className={cn('rounded-lg p-2', typeColors[notification.type as keyof typeof typeColors])}>
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.description}</p>
                        <p className="mt-1 text-[10px] text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-700 p-4">
                  <button className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
          <Settings className="h-4 w-4" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
            <span className="text-xs font-bold text-white">JD</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
