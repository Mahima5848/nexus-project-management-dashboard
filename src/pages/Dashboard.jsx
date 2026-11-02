


import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  CalendarDays,
  CircleCheck,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const chartData = [
  { name: 'Mon', completed: 18, created: 12 },
  { name: 'Tue', completed: 25, created: 16 },
  { name: 'Wed', completed: 20, created: 14 },
  { name: 'Thu', completed: 32, created: 21 },
  { name: 'Fri', completed: 28, created: 18 },
  { name: 'Sat', completed: 40, created: 24 },
  { name: 'Sun', completed: 35, created: 20 },
]

const activities = [
  {
    name: 'Alex Morgan',
    action: 'completed a task in',
    project: 'Website Redesign',
    time: '10 minutes ago',
    initials: 'AM',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Sarah Chen',
    action: 'created a new project',
    project: 'Mobile Application',
    time: '1 hour ago',
    initials: 'SC',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'David Wilson',
    action: 'shared an update in',
    project: 'Marketing Campaign',
    time: '3 hours ago',
    initials: 'DW',
    color: 'bg-green-100 text-green-700',
  },
]

function readStorage(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return saved || []
  } catch {
    return []
  }
}

function StatCard({ stat }) {
  const Icon = stat.icon

  const iconStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyles[stat.color]}`}>
          <Icon size={21} />
        </div>

        <button
          type="button"
          aria-label={`More options for ${stat.title}`}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">
        {stat.title}
      </p>

      <div className="mt-2">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {stat.value}
        </h3>
      </div>

      <p className="mt-1 text-xs text-gray-400">{stat.description}</p>
    </div>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState(() => readStorage('nexus-projects'))
  const [tasks, setTasks] = useState(() => readStorage('nexus-tasks'))
  const [team, setTeam] = useState(() => readStorage('nexus-team'))

  const [profileName, setProfileName] = useState(() => {
    const savedSettings = readStorage('nexus-settings')
    return savedSettings.name || 'Mahima Kushwaha'
  })

  useEffect(() => {
    const updateDashboard = () => {
      setProjects(readStorage('nexus-projects'))
      setTasks(readStorage('nexus-tasks'))
      setTeam(readStorage('nexus-team'))

      const savedSettings = readStorage('nexus-settings')
      setProfileName(savedSettings.name || 'Mahima Kushwaha')
    }

    window.addEventListener('nexus-data-updated', updateDashboard)
    window.addEventListener('nexus-settings-updated', updateDashboard)

    return () => {
      window.removeEventListener('nexus-data-updated', updateDashboard)
      window.removeEventListener('nexus-settings-updated', updateDashboard)
    }
  }, [])

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      description: 'Projects in your workspace',
      icon: FolderKanban,
      color: 'blue',
    },
    {
      title: 'Completed Tasks',
      value: tasks.filter((task) => task.status === 'Done').length,
      description: 'Tasks successfully completed',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'Pending Tasks',
      value: tasks.filter((task) => task.status !== 'Done').length,
      description: 'Tasks waiting for completion',
      icon: Clock3,
      color: 'orange',
    },
    {
      title: 'Team Members',
      value: team.length,
      description: 'Members in your workspace',
      icon: Users,
      color: 'purple',
    },
  ]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingDeadlines = tasks
    .filter((task) => {
      if (!task.dueDate || task.status === 'Done') return false
      const dueDate = new Date(`${task.dueDate}T00:00:00`)
      return dueDate >= today
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  const recentProjects = [...projects].slice(-4).reverse()

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })

  const projectColors = {
    Design: 'bg-blue-500',
    Development: 'bg-purple-500',
    Marketing: 'bg-green-500',
    Research: 'bg-orange-500',
  }

  const firstName = profileName.trim().split(/\s+/)[0] || 'there'

  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
        ? 'Good afternoon'
        : 'Good evening'

  return (
    <div className="mx-auto max-w-7xl space-y-7">

      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {greeting}, {firstName} 👋
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Here's what's happening with your workspace today.
          </p>
        </div>

        <Link
          to="/projects"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Project
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </section>

      {/* Chart and deadlines */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Activity chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Project Overview
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Weekly task activity (sample data)
              </p>
            </div>

            <span className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
              This week
            </span>
          </div>

          <div className="mt-6 flex gap-5 text-xs">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Completed
            </span>

            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
              Created
            </span>
          </div>

          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94A3B8" opacity={0.2} />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#completedGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#A78BFA"
                  strokeWidth={2.5}
                  fill="url(#createdGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your next tasks
              </p>
            </div>

            <CalendarDays size={20} className="text-gray-400" />
          </div>

          <div className="mt-5 space-y-5">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Clock3 size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {item.project || 'General'}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {formatDate(item.dueDate)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                No upcoming deadlines.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Recent projects and activity */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent projects */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Track your active projects
              </p>
            </div>

            <Link
              to="/projects"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/50">
                <tr>
                  {['Project', 'Progress', 'Status', 'Due Date'].map((heading) => (
                    <th key={heading} className="px-5 py-3 text-xs font-semibold text-gray-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {project.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {project.category}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-full ${projectColors[project.category] || 'bg-blue-500'}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>

                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {project.progress}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          {project.progress === 100 ? 'Completed' : 'In Progress'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {project.dueDate ? formatDate(project.dueDate) : 'No deadline'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-gray-400">
                      No projects yet. Create your first project!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Sample team updates
          </p>

          <div className="mt-5 space-y-5">
            {activities.map((activity) => (
              <div key={activity.name} className="flex gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${activity.color}`}>
                  {activity.initials}
                </div>

                <div>
                  <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {activity.name}
                    </span>{' '}
                    {activity.action}{' '}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {activity.project}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-green-600 dark:border-gray-800 dark:text-green-400">
            <CircleCheck size={15} />
            You're all caught up!
          </div>
        </div>
      </section>
    </div>
  )
}

