

import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Building2,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Check,
  Info,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const defaultSettings = {
  name: 'Mahima Kushwaha',
  email: 'mahima@example.com',
  workspace: 'Nexus Workspace',
  emailNotifications: true,
  taskReminders: true,
  projectUpdates: true,
  weeklyReport: false,
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus-settings')
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const [savedMessage, setSavedMessage] = useState(false)

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()

    localStorage.setItem('nexus-settings', JSON.stringify(settings))
    window.dispatchEvent(new Event('nexus-settings-updated'))

    setSavedMessage(true)
    window.setTimeout(() => setSavedMessage(false), 2500)
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      setSettings(defaultSettings)
      localStorage.setItem(
        'nexus-settings',
        JSON.stringify(defaultSettings)
      )
      window.dispatchEvent(new Event('nexus-settings-updated'))
      setSavedMessage(false)
    }
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Workspace / Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and workspace preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <User size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your personal details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Workspace */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Building2 size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Workspace
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customize your workspace name.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Workspace Name
            </label>
            <input
              value={settings.workspace}
              onChange={(e) => updateSetting('workspace', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:max-w-md"
            />
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <Palette size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Appearance
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose your preferred theme.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (theme === 'dark') toggleTheme()
              }}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun size={18} />
              Light Mode
            </button>

            <button
              type="button"
              onClick={() => {
                if (theme === 'light') toggleTheme()
              }}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon size={18} />
              Dark Mode
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <Bell size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customize your demo notification preferences.
              </p>
            </div>
          </div>

          <div className="mb-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-500/10">
            <Info size={19} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-xs leading-5 text-blue-800 dark:text-blue-300">
              These preferences are saved in your browser. Real email
              delivery and automatic weekly reports are not connected
              in this frontend demo.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Demo preference for email updates.',
              },
              {
                key: 'taskReminders',
                label: 'Task Reminders',
                description: 'Demo preference for upcoming task deadlines.',
              },
              {
                key: 'projectUpdates',
                label: 'Project Updates',
                description: 'Demo preference for project activity.',
              },
              {
                key: 'weeklyReport',
                label: 'Weekly Report',
                description: 'Demo preference for a weekly workspace summary.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                <Toggle
                  checked={settings[item.key]}
                  onChange={(value) => updateSetting(item.key, value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RotateCcw size={17} />
            Reset Settings
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
          >
            {savedMessage ? <Check size={18} /> : <Save size={18} />}
            {savedMessage ? 'Saved Successfully' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

