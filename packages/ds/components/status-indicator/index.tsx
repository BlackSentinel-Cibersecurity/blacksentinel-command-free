import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const statusIndicatorVariants = cva(
  'relative inline-flex items-center gap-2',
  {
    variants: {
      variant: {
        dot: '',
        badge: '',
        pulse: '',
      },
    },
    defaultVariants: {
      variant: 'dot',
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  status: 'online' | 'offline' | 'warning' | 'critical' | 'maintenance';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  online: {
    dot: 'bg-green-400',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    pulse: 'bg-green-400',
  },
  offline: {
    dot: 'bg-gray-500',
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    pulse: 'bg-gray-500',
  },
  warning: {
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    pulse: 'bg-yellow-400',
  },
  critical: {
    dot: 'bg-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    pulse: 'bg-red-400',
  },
  maintenance: {
    dot: 'bg-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pulse: 'bg-purple-400',
  },
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Warning',
  critical: 'Critical',
  maintenance: 'Maintenance',
};

const sizes = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
};

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, variant, status, label, size = 'md', ...props }, ref) => {
    const colors = statusColors[status];
    const displayLabel = label || statusLabels[status];

    if (variant === 'badge') {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
            colors.badge,
            className
          )}
          {...props}
        >
          <span className={cn('rounded-full', sizes[size], colors.dot)} />
          {displayLabel}
        </div>
      );
    }

    if (variant === 'pulse') {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center gap-2', className)}
          {...props}
        >
          <span className="relative flex">
            <span className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              colors.pulse,
              sizes[size]
            )} />
            <span className={cn(
              'relative inline-flex rounded-full',
              sizes[size],
              colors.dot
            )} />
          </span>
          {displayLabel && (
            <span className="text-xs text-gray-400">{displayLabel}</span>
          )}
        </div>
      );
    }

    // Default: dot variant
    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', className)}
        {...props}
      >
        <span className={cn('rounded-full', sizes[size], colors.dot)} />
        {displayLabel && (
          <span className="text-xs text-gray-400">{displayLabel}</span>
        )}
      </div>
    );
  }
);
StatusIndicator.displayName = 'StatusIndicator';

export { StatusIndicator, statusIndicatorVariants };
