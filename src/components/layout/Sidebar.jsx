
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  Users,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react'
import Logo from '../common/Logo'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Team', path: '/team', icon: Users },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-1 px-4 pb-6">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Settings size={19} />
            Settings
          </NavLink>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <HelpCircle size={19} />
            Help & Support
          </button>

          <div className="mt-5 rounded-2xl bg-blue-50 p-4 dark:bg-blue-500/10">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Need help?
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Explore tips to manage your workspace better.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
