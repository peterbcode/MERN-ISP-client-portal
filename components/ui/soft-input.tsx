'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SoftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  className?: string
}

const SoftInput = React.forwardRef<HTMLInputElement, SoftInputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          className={cn(
            'input-soft',
            error && 'border-error focus:border-error',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-xs text-text-tertiary">{helperText}</p>
        )}
      </div>
    )
  }
)

SoftInput.displayName = 'SoftInput'

export { SoftInput }
