'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { auth } from '@/lib/auth';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  terms: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  terms?: string;
  general?: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 ${
      hasError ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-700 hover:border-zinc-600'
    }`;

  const getErrorMessage = (error: any, fallback: string) => {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
      return 'Cannot connect to the server. Please try again in a moment.';
    }

    if (Array.isArray(error?.errors) && error.errors.length > 0) {
      return error.errors.join('\n');
    }

    return error?.message || error?.error || fallback;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const username = formData.username.trim();
    const email = formData.email.trim();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (username.length > 30) {
      newErrors.username = 'Username cannot exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const requirements: string[] = [];

      if (formData.password.length < 12) requirements.push('at least 12 characters');
      if (formData.password.length > 128) requirements.push('no more than 128 characters');
      if ((formData.password.match(/\d/g) || []).length < 3) requirements.push('at least 3 numbers');
      if ((formData.password.match(/[A-Z]/g) || []).length < 2) requirements.push('at least 2 uppercase letters');
      if ((formData.password.match(/[a-z]/g) || []).length < 2) requirements.push('at least 2 lowercase letters');
      if ((formData.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length < 2) {
        requirements.push('at least 2 symbols');
      }
      if (/password|123456|qwerty|admin|letmein|welcome|login/i.test(formData.password)) {
        requirements.push('no common words or patterns');
      }
      if (/(.)\1{2,}/.test(formData.password)) {
        requirements.push('no character repeated 3 times in a row');
      }

      if (requirements.length > 0) {
        newErrors.password = `Password must have:\n- ${requirements.join('\n- ')}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!firstName) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? e.target.checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    // Calculate password strength in real-time
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
    if (password.length >= 20) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 70) return 'Good';
    if (strength < 90) return 'Strong';
    return 'Excellent';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await Promise.race([
        auth.register({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          terms: formData.terms,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout - server not responding')), 15000);
        }),
      ]);

      if (response.success) {
        setSuccessMessage('Account created successfully! Welcome to ISP Portal.');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          terms: false,
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Registration failed. Please try again.' });
      }
    } catch (error: any) {
      setErrors({
        general: getErrorMessage(error, 'Registration failed. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-zinc-300">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass(!!errors.firstName)}
              placeholder="John"
              disabled={isLoading}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && <p id="firstName-error" className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-zinc-300">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass(!!errors.lastName)}
              placeholder="Doe"
              disabled={isLoading}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && <p id="lastName-error" className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-zinc-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            className={inputClass(!!errors.username)}
            placeholder="johndoe"
            disabled={isLoading}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username && <p id="username-error" className="mt-1 text-sm text-red-400">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass(!!errors.email)}
            placeholder="john@example.com"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClass(!!errors.password)} pr-12`}
              placeholder="Create a strong password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-hint'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {formData.password && !errors.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className={`flex items-center gap-1 ${formData.password.length >= 12 ? 'text-green-400' : 'text-zinc-500'}`}>
                  {formData.password.length >= 12 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  12+ chars
                </span>
                <span className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-zinc-500'}`}>
                  {/[A-Z]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Uppercase
                </span>
                <span className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-zinc-500'}`}>
                  {/[a-z]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Lowercase
                </span>
                <span className={`flex items-center gap-1 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-zinc-500'}`}>
                  {/\d/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Numbers
                </span>
                <span className={`flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-400' : 'text-zinc-500'}`}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Symbols
                </span>
              </div>
            </div>
          )}
          {errors.password ? (
            <p id="password-error" className="mt-1 whitespace-pre-line text-sm text-red-400">{errors.password}</p>
          ) : (
            <p id="password-hint" className="mt-1 text-xs text-zinc-500">
              Use 12+ characters with uppercase, lowercase, numbers, and symbols.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-zinc-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputClass(!!errors.confirmPassword)} pr-12`}
              placeholder="Confirm your password"
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.terms && (
          <div className="flex gap-2 rounded-lg border border-red-500 bg-red-900/50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
            <p className="text-sm text-red-400">{errors.terms}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex gap-2 rounded-lg border border-green-500 bg-green-900/50 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-green-300" />
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        )}

        {errors.general && (
          <div className="flex gap-2 rounded-lg border border-red-500 bg-red-900/50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
            <p className="whitespace-pre-line text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 disabled:opacity-50"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-zinc-300">
            I agree to{' '}
            <Link href="/terms" className="font-medium text-orange-500 transition-colors hover:text-orange-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-orange-500 transition-colors hover:text-orange-400">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 font-bold text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:from-zinc-700 disabled:to-zinc-700"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-orange-500 transition-colors hover:text-orange-400">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
