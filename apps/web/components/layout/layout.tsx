'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <Header
          onSearchOpen={() => setSearchOpen(true)}
          onCommandOpen={() => setCommandOpen(true)}
        />
        
        <div className="p-6">
          {children}
        </div>
      </motion.main>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-gray-700 px-4 py-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search everything..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                autoFocus
              />
              <kbd className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-[10px] font-medium text-gray-300">
                ESC
              </kbd>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="space-y-1">
                <div className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500">
                  Quick Actions
                </div>
                {[
                  { icon: '🔒', label: 'View all incidents', shortcut: '⌘I' },
                  { icon: '🎯', label: 'Threat Intelligence', shortcut: '⌘T' },
                  { icon: '📊', label: 'Analytics Dashboard', shortcut: '⌘A' },
                  { icon: '⚡', label: 'Automation Center', shortcut: '⌘E' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                    <kbd className="ml-auto rounded border border-gray-600 bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                      {action.shortcut}
                    </kbd>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Command Modal */}
      {commandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl border border-orange-500/30 bg-gray-900 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center gap-3 border-b border-gray-700 px-4 py-3">
              <img src="/icons/logo.png" alt="AI Command" className="h-8 w-8" />
              <input
                type="text"
                placeholder="Ask AI Command anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                autoFocus
              />
              <kbd className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-[10px] font-medium text-gray-300">
                ESC
              </kbd>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="text-xs font-medium text-gray-500">
                  Suggested Queries
                </div>
                {[
                  'What are the most critical vulnerabilities right now?',
                  'Show me all assets affected by Log4Shell',
                  'Generate an executive security report',
                  'Which users pose the highest risk?',
                  'Create a playbook for ransomware response',
                ].map((query) => (
                  <button
                    key={query}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-white"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
