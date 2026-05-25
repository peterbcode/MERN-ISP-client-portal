'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { safeAlert } from '@/lib/native-dialog';

const SETTINGS_STORAGE_KEY = 'vc_dashboard_settings';

type Notifications = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
};

type Privacy = {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowDataCollection: boolean;
};

type Preferences = {
  theme: 'dark' | 'light' | 'auto';
  language: 'en' | 'es' | 'fr' | 'de';
  timezone: 'UTC' | 'EST' | 'PST' | 'GMT' | 'CAT';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
};

type SettingsState = {
  notifications: Notifications;
  privacy: Privacy;
  preferences: Preferences;
};

const defaultSettings: SettingsState = {
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: false,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  },
};

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isOption = <T extends string>(value: unknown, options: readonly T[]): value is T =>
  typeof value === 'string' && options.includes(value as T);

const sanitizeSettings = (value: unknown): SettingsState => {
  const raw = value && typeof value === 'object' ? value as Partial<SettingsState> : {};
  const notifications = raw.notifications || {};
  const privacy = raw.privacy || {};
  const preferences = raw.preferences || {};

  return {
    notifications: {
      emailNotifications: isBoolean(notifications.emailNotifications)
        ? notifications.emailNotifications
        : defaultSettings.notifications.emailNotifications,
      pushNotifications: isBoolean(notifications.pushNotifications)
        ? notifications.pushNotifications
        : defaultSettings.notifications.pushNotifications,
      smsNotifications: isBoolean(notifications.smsNotifications)
        ? notifications.smsNotifications
        : defaultSettings.notifications.smsNotifications,
      marketingEmails: isBoolean(notifications.marketingEmails)
        ? notifications.marketingEmails
        : defaultSettings.notifications.marketingEmails,
    },
    privacy: {
      profileVisibility: isOption(privacy.profileVisibility, ['public', 'private', 'friends'] as const)
        ? privacy.profileVisibility
        : defaultSettings.privacy.profileVisibility,
      showEmail: isBoolean(privacy.showEmail) ? privacy.showEmail : defaultSettings.privacy.showEmail,
      showPhone: isBoolean(privacy.showPhone) ? privacy.showPhone : defaultSettings.privacy.showPhone,
      allowDataCollection: isBoolean(privacy.allowDataCollection)
        ? privacy.allowDataCollection
        : defaultSettings.privacy.allowDataCollection,
    },
    preferences: {
      theme: isOption(preferences.theme, ['dark', 'light', 'auto'] as const)
        ? preferences.theme
        : defaultSettings.preferences.theme,
      language: isOption(preferences.language, ['en', 'es', 'fr', 'de'] as const)
        ? preferences.language
        : defaultSettings.preferences.language,
      timezone: isOption(preferences.timezone, ['UTC', 'EST', 'PST', 'GMT', 'CAT'] as const)
        ? preferences.timezone
        : defaultSettings.preferences.timezone,
      dateFormat: isOption(preferences.dateFormat, ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] as const)
        ? preferences.dateFormat
        : defaultSettings.preferences.dateFormat,
    },
  };
};

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="heading-compact text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      </div>
      <label className="relative inline-flex w-fit cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-zinc-700 transition-colors peer-checked:bg-orange-500 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-400" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <label className="block py-3">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#101114]">
      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <h2 className="heading-compact text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="divide-y divide-white/10 px-4 sm:px-6">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [lastSavedSettings, setLastSavedSettings] = useState<SettingsState>(defaultSettings);
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await auth.getCurrentUser();
        if (response.success) {
          setUser(response.user);
        } else {
          auth.clearToken();
          router.push('/login');
        }
      } catch {
        auth.clearToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) return;

      const parsed = sanitizeSettings(JSON.parse(saved));
      setSettings(parsed);
      setLastSavedSettings(parsed);
    } catch {
      window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.portalTheme = settings.preferences.theme;
  }, [settings.preferences.theme]);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(lastSavedSettings),
    [settings, lastSavedSettings],
  );

  const updateNotifications = <K extends keyof Notifications>(key: K, value: Notifications[K]) => {
    setSaveMessage('');
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const updatePrivacy = <K extends keyof Privacy>(key: K, value: Privacy[K]) => {
    setSaveMessage('');
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  };

  const updatePreferences = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setSaveMessage('');
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setLastSavedSettings(settings);
      setSaveMessage('Settings saved on this device.');
      safeAlert('Settings saved successfully!');
    } catch {
      setSaveMessage('');
      safeAlert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setSaveMessage('');
  };

  if (isLoading && !user) {
    return (
      <div className="flex h-64 items-center justify-center text-white">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="heading-compact text-2xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage your account preferences and configuration</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300">
          {hasUnsavedChanges ? 'Unsaved changes' : saveMessage || 'All changes saved'}
        </div>
      </div>

      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-100">
        These preferences are saved locally on this device until server-side account preferences are connected.
      </div>

      <SettingsSection title="Notification Preferences">
        <ToggleRow
          title="Email Notifications"
          description="Receive updates and alerts via email"
          checked={settings.notifications.emailNotifications}
          onChange={(checked) => updateNotifications('emailNotifications', checked)}
        />
        <ToggleRow
          title="Push Notifications"
          description="Receive browser push notifications"
          checked={settings.notifications.pushNotifications}
          onChange={(checked) => updateNotifications('pushNotifications', checked)}
        />
        <ToggleRow
          title="SMS Notifications"
          description="Receive text message alerts"
          checked={settings.notifications.smsNotifications}
          onChange={(checked) => updateNotifications('smsNotifications', checked)}
        />
        <ToggleRow
          title="Marketing Emails"
          description="Receive promotional offers and newsletters"
          checked={settings.notifications.marketingEmails}
          onChange={(checked) => updateNotifications('marketingEmails', checked)}
        />
      </SettingsSection>

      <SettingsSection title="Privacy Settings">
        <SelectField
          label="Profile Visibility"
          value={settings.privacy.profileVisibility}
          onChange={(value) => updatePrivacy('profileVisibility', value)}
          options={[
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
            { label: 'Friends Only', value: 'friends' },
          ]}
        />
        <ToggleRow
          title="Show Email Address"
          description="Display email in your profile"
          checked={settings.privacy.showEmail}
          onChange={(checked) => updatePrivacy('showEmail', checked)}
        />
        <ToggleRow
          title="Show Phone Number"
          description="Display phone in your profile"
          checked={settings.privacy.showPhone}
          onChange={(checked) => updatePrivacy('showPhone', checked)}
        />
        <ToggleRow
          title="Data Collection"
          description="Allow us to collect usage data for improvements"
          checked={settings.privacy.allowDataCollection}
          onChange={(checked) => updatePrivacy('allowDataCollection', checked)}
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SelectField
          label="Theme"
          value={settings.preferences.theme}
          onChange={(value) => updatePreferences('theme', value)}
          options={[
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
            { label: 'Auto', value: 'auto' },
          ]}
        />
        <SelectField
          label="Language"
          value={settings.preferences.language}
          onChange={(value) => updatePreferences('language', value)}
          options={[
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
          ]}
        />
        <SelectField
          label="Timezone"
          value={settings.preferences.timezone}
          onChange={(value) => updatePreferences('timezone', value)}
          options={[
            { label: 'UTC', value: 'UTC' },
            { label: 'Eastern Time', value: 'EST' },
            { label: 'Pacific Time', value: 'PST' },
            { label: 'GMT', value: 'GMT' },
            { label: 'Central Africa Time', value: 'CAT' },
          ]}
        />
        <SelectField
          label="Date Format"
          value={settings.preferences.dateFormat}
          onChange={(value) => updatePreferences('dateFormat', value)}
          options={[
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
            { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          ]}
        />
      </SettingsSection>

      <div className="sticky bottom-0 -mx-4 border-t border-white/10 bg-[#08090b]/90 px-4 py-4 backdrop-blur-xl sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetSettings}
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={saveSettings}
            disabled={isSaving || !hasUnsavedChanges}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Settings' : 'Saved'}
          </button>
        </div>
      </div>
    </div>
  );
}
