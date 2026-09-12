import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 text-gray-300 border border-gray-700',
        primary: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        success: 'bg-green-500/10 text-green-400 border border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        critical: 'bg-red-500/10 text-red-400 border border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        outline: 'text-gray-300 border border-gray-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          variant === 'success' && 'bg-green-400',
          variant === 'warning' && 'bg-yellow-400',
          variant === 'critical' && 'bg-red-400',
          variant === 'info' && 'bg-blue-400',
          variant === 'primary' && 'bg-orange-400',
          variant === 'default' && 'bg-gray-400',
          variant === 'outline' && 'bg-gray-400',
        )} />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
