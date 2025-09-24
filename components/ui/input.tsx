import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 🧱 Base styles
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md',
        'border border-gray-300 bg-transparent mt-1.5 px-3.5 py-1.5 text-base',
        'shadow-xs transition-[color,box-shadow] outline-none',
        
        // 🧠 Focus & Validation
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        // 🛑 Disabled
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

        className,
      )}
      {...props}
    />
  )
}

export { Input }
