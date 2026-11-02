


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  X,
  FolderKanban,
  CheckSquare,
  Check,
  Trash2,
  BellRing,
} from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function readProfileName() {
  try {
    const settings = JSON.parse(localStorage.getItem('nexus-settings'))
    return settings?.name || 'Mahima Kushwaha'
  } catch {
    return 'Mahima Kushwaha'
  }
}

export default function Header({ onMenuClick }) {
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState(() => readStorage('nexus-projects'))
  const [tasks, setTasks] = useState(() => readStorage('nexus-tasks'))
  const [notifications, setNotifications] = useState(() =>
    readStorage('nexus-notifications')
  )
  const [showNotifications, setShowNotifications] = useState(false)
  const [profileName, setProfileName] = useState(readProfileName)

  useEffect(() => {
    const updateData = () => {
      setProjects(readStorage('nexus-projects'))
      setTasks(readStorage('nexus-tasks'))
    }

    const updateNotifications = () => {
      setNotifications(readStorage('nexus-notifications'))
    }

    const updateProfile = () => {
      setProfileName(readProfileName())
    }

    window.addEventListener('nexus-data-updated', updateData)
    window.addEventListener(
      'nexus-notifications-updated',
      updateNotifications
    )
    window.addEventListener('nexus-settings-updated', updateProfile)

    return () => {
      window.removeEventListener('nexus-data-updated', updateData)
      window.removeEventListener(
        'nexus-notifications-updated',
        updateNotifications
      )
      window.removeEventListener('nexus-settings-updated', updateProfile)
    }
  }, [])

  const query = search.trim().toLowerCase()

  const projectResults = projects
    .filter((project) => project.name?.toLowerCase().includes(query))
    .slice(0, 5)

  const taskResults = tasks
    .filter((task) => task.title?.toLowerCase().includes(query))
    .slice(0, 5)

  const hasResults = projectResults.length > 0 || taskResults.length > 0

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    )

    setNotifications(updated)
    localStorage.setItem('nexus-notifications', JSON.stringify(updated))
    window.dispatchEvent(new Event('nexus-notifications-updated'))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setNotifications(updated)
    localStorage.setItem('nexus-notifications', JSON.stringify(updated))
    window.dispatchEvent(new Event('nexus-notifications-updated'))
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.setItem('nexus-notifications', JSON.stringify([]))
    window.dispatchEvent(new Event('nexus-notifications-updated'))
  }

  const formatTime = (time) => {
    if (!time) return ''

    const date = new Date(time)

    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const initials = profileName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90 sm:px-6 lg:px-8">

      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden w-64 md:block lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects and tasks..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          )}

          {query && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
              {!hasResults ? (
                <p className="p-4 text-center text-sm text-gray-400">
                  No results found.
                </p>
              ) : (
                <>
                  {projectResults.length > 0 && (
                    <div>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Projects
                      </p>

                      {projectResults.map((project) => (
                        <Link
                          key={project.id}
                          to="/projects"
                          onClick={() => setSearch('')}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <FolderKanban size={17} className="text-blue-500" />
                          <span className="truncate">{project.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {taskResults.length > 0 && (
                    <div>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Tasks
                      </p>

                      {taskResults.map((task) => (
                        <Link
                          key={task.id}
                          to="/tasks"
                          onClick={() => setSearch('')}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <CheckSquare size={17} className="text-purple-500" />
                          <span className="truncate">{task.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((previous) => !previous)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-950">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">

              <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={18} />
                </button>
              </div>

              {notifications.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-4 py-2">
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Mark all as read
                    </button>

                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                      Clear all
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex gap-3 border-t border-gray-100 p-4 dark:border-gray-800 ${
                          !notification.read
                            ? 'bg-blue-50/60 dark:bg-blue-500/5'
                            : ''
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                          <BellRing size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {formatTime(notification.time)}
                          </p>

                          {!notification.read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(notification.id)}
                              className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              <Check size={13} />
                              Mark as read
                            </button>
                          )}
                        </div>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-4 py-10 text-center">
                  <Bell size={28} className="mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Your project updates will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-gray-200 dark:bg-gray-800 sm:block" />

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            {initials || 'MK'}
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {profileName.split(/\s+/)[0]}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Free Plan
            </p>
          </div>

          <ChevronDown size={16} className="hidden text-gray-400 md:block" />
        </button>
      </div>
    </header>
  )
}



