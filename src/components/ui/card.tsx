import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/5 bg-deep/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
