'use client'

import { useState } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SoftCard } from '@/components/ui/soft-card'
import { SoftButton } from '@/components/ui/soft-button'
import { SoftInput } from '@/components/ui/soft-input'

interface LoginFormSoftProps {
  onSuccess?: () => void
}

const LoginFormSoft = ({ onSuccess }: LoginFormSoftProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await auth.login(formData)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-accent-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-semibold text-text-primary">
              Valley Computers
            </span>
          </div>
          <p className="text-text-secondary mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <SoftCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <SoftInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <SoftInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="soft-card-inset p-3 text-sm text-error text-center">
                {error}
              </div>
            )}

            <SoftButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </SoftButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-tertiary">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent-primary hover:text-accent-primary-hover transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </SoftCard>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <Link 
            href="/forgot-password" 
            className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Forgot your password?
          </Link>
          <div className="text-xs text-text-tertiary">
            © 2024 Valley Computers. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginFormSoft
