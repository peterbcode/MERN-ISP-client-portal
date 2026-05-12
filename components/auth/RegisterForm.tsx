'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    terms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username cannot exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const requirements = [];
      
      if (formData.password.length < 6) {
        requirements.push('at least 6 characters');
      }
      
      if (!/[a-zA-Z]/.test(formData.password)) {
        requirements.push('at least 1 letter');
      }
      
      if (!/[0-9]/.test(formData.password)) {
        requirements.push('at least 1 number');
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?\/]/.test(formData.password)) {
        requirements.push('at least 1 symbol');
      }
      
      if (requirements.length > 0) {
        newErrors.password = `Password must have:\n• ${requirements.join('\n• ')}`;
      } else {
        // Clear password error if all requirements are met
        newErrors.password = undefined;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation (optional but if provided should be valid)
    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }
    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('=== FORM SUBMISSION START ===');
    e.preventDefault();
    
    console.log('Form submitted:', formData);
    console.log('Form valid:', validateForm());
    
    if (!validateForm()) {
      console.log('Form validation failed');
      console.log('=== FORM SUBMISSION FAILED (VALIDATION) ===');
      return;
    }

    console.log('Starting registration process...');
    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registrationData } = formData;
      console.log('Sending registration data:', registrationData);
      console.log('API endpoint:', process.env.NEXT_PUBLIC_API_URL || '/api');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - server not responding')), 15000);
      });
      
      const response = await Promise.race([
        auth.register(registrationData),
        timeoutPromise
      ]);
      
      console.log('Registration response:', response);
      
      if (response.success) {
        // Show success message
        setSuccessMessage('Account created successfully! Welcome to ISP Portal.');
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          terms: false
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      console.log('Setting error message:', errorMessage);
      setErrors({
        general: errorMessage
      });
    } finally {
      setIsLoading(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.firstName ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="John"
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.lastName ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="Doe"
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.username ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="johndoe"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-400">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="john@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
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
              className={`w-full px-4 py-3 pr-12 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="Create a strong password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
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
              className={`w-full px-4 py-3 pr-12 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.terms && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
            <p className="text-sm text-red-400">{errors.terms}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            checked={formData.terms}
            onChange={handleChange}
            className="w-4 h-4 bg-zinc-800 border-zinc-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-zinc-300">
            I agree to{' '}
            <Link href="/terms" className="text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 font-medium inline-block">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 font-medium inline-block">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
          style={{ position: 'relative', zIndex: 10 }}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 font-medium inline-block"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
