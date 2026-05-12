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
