'use client';

import * as React from 'react';
import { cn } from '@blacksentinel/ds/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@blacksentinel/ds/components/card';
import { Badge } from '@blacksentinel/ds/components/badge';
import { Button } from '@blacksentinel/ds/components/button';
import {
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw,
  MoreVertical,
  GripVertical,
  Copy,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Widget Types
// ============================================================================

export type WidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'list'
  | 'graph'
  | 'map'
  | 'timeline'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'matrix'
  | 'gauge'
  | 'progress'
  | 'status'
  | 'activity'
  | 'ai-insights';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  refreshInterval?: number;
  dataSource?: string;
  filters?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

export interface WidgetProps {
  config: WidgetConfig;
  isEditing?: boolean;
  onRefresh?: () => void;
  onConfigure?: () => void;
  onRemove?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
  children?: React.ReactNode;
}

// ============================================================================
// Widget Component
// ============================================================================

export function Widget({
  config,
  isEditing = false,
  onRefresh,
  onConfigure,
  onRemove,
  children,
}: WidgetProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative',
        isExpanded && 'fixed inset-4 z-50'
      )}
    >
      <Card
        variant="interactive"
        className={cn(
          'h-full overflow-hidden',
          isExpanded && 'h-full'
        )}
      >
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {isEditing && (
              <div className="cursor-grab text-gray-500 hover:text-gray-300">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <div>
              <CardTitle className="text-sm">{config.title}</CardTitle>
              {config.description && (
                <p className="text-[10px] text-gray-500">{config.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {config.refreshInterval && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onRefresh}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl"
                  >
                    <button
                      onClick={() => {
                        onConfigure?.();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      <Settings className="h-3 w-3" />
                      Configure
                    </button>
                    <button
                      onClick={() => {
                        onRefresh?.();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </button>
                    <div className="my-1 border-t border-gray-700" />
                    <button
                      onClick={() => {
                        onRemove?.();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-2.5rem)] overflow-auto">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// Widget Library
// ============================================================================

export const WIDGET_LIBRARY: Array<{
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultSize: { width: number; height: number };
  category: string;
}> = [
  {
    type: 'metric',
    name: 'Metric Card',
    description: 'Display a single key metric with trend',
    icon: '📊',
    defaultSize: { width: 1, height: 1 },
    category: 'Basic',
  },
  {
    type: 'chart',
    name: 'Chart',
    description: 'Visualize data with various chart types',
    icon: '📈',
    defaultSize: { width: 2, height: 2 },
    category: 'Visualization',
  },
  {
    type: 'table',
    name: 'Data Table',
    description: 'Display structured data in a table',
    icon: 'TABLE',
    defaultSize: { width: 2, height: 2 },
    category: 'Basic',
  },
  {
    type: 'list',
    name: 'List',
    description: 'Display items in a list format',
    icon: 'LIST',
    defaultSize: { width: 1, height: 2 },
    category: 'Basic',
  },
  {
    type: 'graph',
    name: 'Graph',
    description: 'Visualize relationships between entities',
    icon: 'GRAPH',
    defaultSize: { width: 2, height: 2 },
    category: 'Advanced',
  },
  {
    type: 'map',
    name: 'World Map',
    description: 'Geospatial visualization',
    icon: 'MAP',
    defaultSize: { width: 2, height: 2 },
    category: 'Visualization',
  },
  {
    type: 'timeline',
    name: 'Timeline',
    description: 'Show events over time',
    icon: 'TIMELINE',
    defaultSize: { width: 2, height: 1 },
    category: 'Visualization',
  },
  {
    type: 'heatmap',
    name: 'Heatmap',
    description: 'Visualize intensity patterns',
    icon: 'HEATMAP',
    defaultSize: { width: 2, height: 2 },
    category: 'Visualization',
  },
  {
    type: 'treemap',
    name: 'Treemap',
    description: 'Hierarchical data visualization',
    icon: 'TREEMAP',
    defaultSize: { width: 2, height: 2 },
    category: 'Advanced',
  },
  {
    type: 'sankey',
    name: 'Sankey Diagram',
    description: 'Flow visualization',
    icon: 'SANKEY',
    defaultSize: { width: 2, height: 2 },
    category: 'Advanced',
  },
  {
    type: 'matrix',
    name: 'MITRE Matrix',
    description: 'ATT&CK technique matrix',
    icon: 'MATRIX',
    defaultSize: { width: 2, height: 2 },
    category: 'Security',
  },
  {
    type: 'gauge',
    name: 'Gauge',
    description: 'Display a value within a range',
    icon: 'GAUGE',
    defaultSize: { width: 1, height: 1 },
    category: 'Basic',
  },
  {
    type: 'progress',
    name: 'Progress Bar',
    description: 'Show completion or progress',
    icon: 'PROGRESS',
    defaultSize: { width: 1, height: 1 },
    category: 'Basic',
  },
  {
    type: 'status',
    name: 'Status Grid',
    description: 'Display system or component status',
    icon: 'STATUS',
    defaultSize: { width: 2, height: 1 },
    category: 'Security',
  },
  {
    type: 'activity',
    name: 'Activity Feed',
    description: 'Real-time activity stream',
    icon: '📡',
    defaultSize: { width: 1, height: 2 },
    category: 'Basic',
  },
  {
    type: 'ai-insights',
    name: 'AI Insights',
    description: 'AI-generated recommendations and analysis',
    icon: '🧠',
    defaultSize: { width: 2, height: 2 },
    category: 'Advanced',
  },
];

// ============================================================================
// Dashboard Grid System
// ============================================================================

export interface DashboardGridProps {
  widgets: WidgetConfig[];
  columns?: number;
  rowHeight?: number;
  isEditing?: boolean;
  onWidgetsChange?: (widgets: WidgetConfig[]) => void;
  onWidgetRefresh?: (widgetId: string) => void;
  onWidgetConfigure?: (widgetId: string) => void;
  onWidgetRemove?: (widgetId: string) => void;
}

export function DashboardGrid({
  widgets,
  columns = 12,
  rowHeight = 100,
  isEditing = false,
  onWidgetRefresh,
  onWidgetConfigure,
  onWidgetRemove,
}: DashboardGridProps) {
  const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null);

  const handleDragStart = (widgetId: string) => {
    if (isEditing) {
      setDraggedWidget(widgetId);
    }
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {widgets.map((widget) => (
        <div
          key={widget.id}
          draggable={isEditing}
          onDragStart={() => handleDragStart(widget.id)}
          onDragEnd={handleDragEnd}
          style={{
            gridColumn: `span ${widget.size.width}`,
            gridRow: `span ${widget.size.height}`,
          }}
          className={cn(
            'transition-all',
            isEditing && 'cursor-move hover:ring-2 hover:ring-orange-500/30',
            draggedWidget === widget.id && 'opacity-50'
          )}
        >
          <Widget
            config={widget}
            isEditing={isEditing}
            onRefresh={() => onWidgetRefresh?.(widget.id)}
            onConfigure={() => onWidgetConfigure?.(widget.id)}
            onRemove={() => onWidgetRemove?.(widget.id)}
          >
            <WidgetContent type={widget.type} config={widget} />
          </Widget>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Widget Content Renderers
// ============================================================================

function WidgetContent({ type, config }: { type: WidgetType; config: WidgetConfig }) {
  switch (type) {
    case 'metric':
      return <MetricWidgetContent config={config} />;
    case 'chart':
      return <ChartWidgetContent config={config} />;
    case 'table':
      return <TableWidgetContent config={config} />;
    case 'list':
      return <ListWidgetContent config={config} />;
    case 'graph':
      return <GraphWidgetContent config={config} />;
    case 'timeline':
      return <TimelineWidgetContent config={config} />;
    case 'status':
      return <StatusWidgetContent config={config} />;
    case 'activity':
      return <ActivityWidgetContent config={config} />;
    case 'ai-insights':
      return <AIInsightsWidgetContent config={config} />;
    default:
      return <div className="flex h-full items-center justify-center text-gray-500">Widget type not implemented</div>;
  }
}

function MetricWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-3xl font-bold text-white">87</p>
      <p className="text-sm text-gray-400">Security Score</p>
      <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
        <span>+3%</span>
        <span className="text-gray-500">vs last week</span>
      </div>
    </div>
  );
}

function ChartWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-2 h-32 w-full rounded bg-gradient-to-r from-orange-500/20 to-orange-500/5" />
        <p className="text-xs text-gray-500">Chart visualization</p>
      </div>
    </div>
  );
}

function TableWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="space-y-2">
      {[
        { name: 'server-prod-01', status: 'healthy', risk: 'low' },
        { name: 'server-prod-02', status: 'warning', risk: 'medium' },
        { name: 'server-prod-03', status: 'healthy', risk: 'low' },
      ].map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between rounded bg-gray-800/50 p-2 text-xs"
        >
          <span className="text-white">{row.name}</span>
          <Badge
            variant={row.status === 'healthy' ? 'success' : 'warning'}
            size="sm"
          >
            {row.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function ListWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="space-y-2">
      {['Critical: Ransomware detected', 'High: Brute force attempt', 'Medium: Certificate expiring'].map(
        (item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded bg-gray-800/50 p-2 text-xs"
          >
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-yellow-500'
              )}
            />
            <span className="text-gray-300">{item}</span>
          </div>
        )
      )}
    </div>
  );
}

function GraphWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-600 bg-gray-800">
            <div className="h-8 w-8 rounded-full bg-orange-500/20" />
          </div>
        </div>
        <p className="text-xs text-gray-500">Knowledge Graph</p>
      </div>
    </div>
  );
}

function TimelineWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="space-y-3">
      {[
        { time: '14:32', event: 'Alert triggered', type: 'critical' },
        { time: '14:15', event: 'Investigation started', type: 'info' },
        { time: '13:45', event: 'Incident created', type: 'warning' },
      ].map((item, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                item.type === 'critical' ? 'bg-red-500' :
                item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              )}
            />
            {i < 2 && <div className="mt-1 h-full w-px bg-gray-700" />}
          </div>
          <div>
            <p className="text-[10px] text-gray-500">{item.time}</p>
            <p className="text-xs text-white">{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { name: 'Cloud', status: 'online' },
        { name: 'Network', status: 'online' },
        { name: 'Endpoints', status: 'warning' },
        { name: 'Databases', status: 'online' },
        { name: 'Containers', status: 'online' },
        { name: 'IoT', status: 'critical' },
      ].map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center rounded bg-gray-800/50 p-2"
        >
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              item.status === 'online' ? 'bg-green-500' :
              item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            )}
          />
          <span className="mt-1 text-[10px] text-gray-400">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="space-y-2">
      {[
        { user: 'John Doe', action: 'blocked IP 192.168.1.100', time: '2m ago' },
        { user: 'Jane Smith', action: 'created incident INC-001', time: '15m ago' },
        { user: 'Bob Wilson', action: 'ran playbook PB-001', time: '1h ago' },
      ].map((item, i) => (
        <div key={i} className="rounded bg-gray-800/50 p-2">
          <p className="text-xs text-white">
            <span className="font-medium">{item.user}</span>{' '}
            <span className="text-gray-400">{item.action}</span>
          </p>
          <p className="text-[10px] text-gray-500">{item.time}</p>
        </div>
      ))}
    </div>
  );
}

function AIInsightsWidgetContent({ config: _config }: { config: WidgetConfig }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🧠</span>
          <span className="text-xs font-medium text-orange-400">AI Recommendation</span>
        </div>
        <p className="mt-1 text-xs text-gray-300">
          Isolate server-prod-01 immediately due to detected ransomware activity.
        </p>
      </div>
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-xs font-medium text-gray-300">Trend Analysis</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Phishing attempts increased 23% this week. Consider additional training.
        </p>
      </div>
    </div>
  );
}

export default Widget;
