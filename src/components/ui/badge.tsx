import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-800 text-neutral-200',
        secondary: 'border-transparent bg-neutral-900 text-neutral-400',
        destructive: 'border-transparent bg-red-950/60 text-red-300',
        success: 'border-transparent bg-emerald-950/60 text-emerald-300',
        outline: 'border-neutral-700 text-neutral-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
