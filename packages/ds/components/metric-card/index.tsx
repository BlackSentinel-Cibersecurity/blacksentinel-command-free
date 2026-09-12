import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Card } from '../card';
import { Badge } from '../badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const metricCardVariants = cva('', {
  variants: {
    variant: {
      default: '',
      success: '',
      warning: '',
      critical: '',
      glow: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'online' | 'offline' | 'warning' | 'critical';
  loading?: boolean;
  sparkline?: React.ReactNode;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      variant,
      title,
      value,
      change,
      changeLabel,
      icon,
      trend,
      status,
      loading,
      sparkline,
      ...props
    },
    ref
  ) => {
    if (loading) {
      return (
        <Card ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-800" />
            <div className="mt-3 h-8 w-32 rounded bg-gray-800" />
            <div className="mt-2 h-3 w-20 rounded bg-gray-800" />
          </div>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        variant={variant === 'glow' ? 'glow' : 'default'}
        className={cn(
          'relative overflow-hidden',
          variant === 'critical' && 'border-red-500/30 bg-red-500/5',
          variant === 'success' && 'border-green-500/30 bg-green-500/5',
          variant === 'warning' && 'border-yellow-500/30 bg-yellow-500/5',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={cn(
                'text-2xl font-bold tracking-tight',
                variant === 'critical' && 'text-red-400',
                variant === 'success' && 'text-green-400',
                variant === 'warning' && 'text-yellow-400',
                !variant || variant === 'default' || variant === 'glow' && 'text-white'
              )}>
                {value}
              </p>
              {change !== undefined && (
                <div className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  trend === 'up' && 'text-green-400',
                  trend === 'down' && 'text-red-400',
                  trend === 'neutral' && 'text-gray-400'
                )}>
                  {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  {trend === 'neutral' && <Minus className="h-3 w-3" />}
                  <span>{change > 0 ? '+' : ''}{change}%</span>
                </div>
              )}
            </div>
            {changeLabel && (
              <p className="text-[11px] text-gray-500">{changeLabel}</p>
            )}
          </div>
          <div className={cn(
            'rounded-lg p-2',
            variant === 'critical' && 'bg-red-500/10',
            variant === 'success' && 'bg-green-500/10',
            variant === 'warning' && 'bg-yellow-500/10',
            (!variant || variant === 'default' || variant === 'glow') && 'bg-gray-800'
          )}>
            {icon && (
              <div className={cn(
                'h-5 w-5',
                variant === 'critical' && 'text-red-400',
                variant === 'success' && 'text-green-400',
                variant === 'warning' && 'text-yellow-400',
                (!variant || variant === 'default' || variant === 'glow') && 'text-gray-400'
              )}>
                {icon}
              </div>
            )}
            {status && (
              <div className={cn(
                'h-2 w-2 rounded-full',
                status === 'online' && 'bg-green-400',
                status === 'offline' && 'bg-gray-500',
                status === 'warning' && 'bg-yellow-400',
                status === 'critical' && 'bg-red-400 animate-pulse'
              )} />
            )}
          </div>
        </div>
        {sparkline && (
          <div className="mt-3 h-12">
            {sparkline}
          </div>
        )}
      </Card>
    );
  }
);
MetricCard.displayName = 'MetricCard';

export { MetricCard, metricCardVariants };
