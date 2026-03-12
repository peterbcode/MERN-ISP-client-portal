'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    address?: string;
  };
  stats: {
    loginCount: number;
    lastLogin: string;
    accountCreated: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!auth.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const response = await auth.getCurrentUser();
      if (response.success) {
        setUser(response.user);
        setFormData({
          firstName: response.user.profile?.firstName || '',
          lastName: response.user.profile?.lastName || '',
          email: response.user.email || '',
          phone: response.user.profile?.phone || '',
          address: response.user.profile?.address || ''
        });
      } else {
        auth.clearToken();
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || ''
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address
          }
        };
        setUser(updatedUser);
      }
      
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update profile. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading && !user) {
    return <div className="flex items-center justify-center h-64 text-white">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-zinc-400">Manage your account information and preferences</p>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('successfully') 
            ? 'bg-green-500/20 border border-green-500 text-green-400' 
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white disabled:opacity-50"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white disabled:opacity-50"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white disabled:opacity-50"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white disabled:opacity-50"
              placeholder="Enter your address"
            />
          </div>
        </form>
      </div>

      {/* Account Statistics */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold text-white mb-4">Account Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-zinc-400 mb-1">Account Created</div>
            <div className="text-lg font-semibold text-white">
              {user?.stats?.accountCreated ? 
                new Date(user.stats.accountCreated).toLocaleDateString() : 
                'N/A'
              }
            </div>
          </div>
          
          <div>
            <div className="text-sm text-zinc-400 mb-1">Total Logins</div>
            <div className="text-lg font-semibold text-white">
              {user?.stats?.loginCount || 0}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-zinc-400 mb-1">Last Login</div>
            <div className="text-lg font-semibold text-white">
              {user?.stats?.lastLogin ? 
                new Date(user.stats.lastLogin).toLocaleString() : 
                'N/A'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-zinc-700">
            <div>
              <h3 className="text-white font-medium">Change Password</h3>
              <p className="text-sm text-zinc-400">Update your account password</p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-zinc-700">
            <div>
              <h3 className="text-white font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-zinc-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">
              Setup 2FA
            </button>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="text-white font-medium">Login History</h3>
              <p className="text-sm text-zinc-400">View recent login activity</p>
            </div>
            <button className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-zinc-300 mb-4">Irreversible actions for your account</p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">Delete Account</h3>
              <p className="text-sm text-zinc-400">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
