import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { X, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

const alertBannerVariants = cva(
  'relative flex w-full rounded-lg border p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        critical: 'bg-red-500/10 border-red-500/20 text-red-400',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  critical: AlertCircle,
};

export interface AlertBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBannerVariants> {
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  action?: React.ReactNode;
}

const AlertBanner = React.forwardRef<HTMLDivElement, AlertBannerProps>(
  ({ className, variant, title, description, closable, onClose, action, children, ...props }, ref) => {
    const Icon = iconMap[variant || 'info'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertBannerVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <div className="flex-1 space-y-1">
          {title && (
            <h5 className="text-sm font-medium leading-none tracking-tight">{title}</h5>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
          {children}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {closable && (
            <button
              onClick={onClose}
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
AlertBanner.displayName = 'AlertBanner';

export { AlertBanner, alertBannerVariants };
