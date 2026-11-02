
import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  FolderKanban,
  CalendarDays,
  MoreHorizontal,
  Trash2,
  X,
  CheckCircle2,
  Clock3,
} from 'lucide-react'
import { motion } from 'framer-motion'

const initialProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesigning the company website with a modern UI.',
    category: 'Design',
    progress: 75,
    dueDate: '2026-11-02',
    color: 'blue',
  },
  {
    id: 2,
    name: 'Mobile Application',
    description: 'Building a responsive mobile application.',
    category: 'Development',
    progress: 45,
    dueDate: '2026-11-04',
    color: 'purple',
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    description: 'Planning and launching a digital campaign.',
    category: 'Marketing',
    progress: 90,
    dueDate: '2026-11-05',
    color: 'orange',
  },
  {
    id: 4,
    name: 'Dashboard UI',
    description: 'Creating an analytics dashboard interface.',
    category: 'Development',
    progress: 100,
    dueDate: '2026-10-28',
    color: 'green',
  },
]

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
}

const emptyForm = {
  name: '',
  description: '',
  category: 'Development',
  dueDate: '',
  color: 'blue',
}

export default function Projects() {
  const addNotification = (message) => {
    try {
      const notifications = JSON.parse(
        localStorage.getItem('nexus-notifications') || '[]'
      )

      const newNotification = {
        id: Date.now(),
        message,
        time: new Date().toISOString(),
        read: false,
      }

      localStorage.setItem(
        'nexus-notifications',
        JSON.stringify([newNotification, ...notifications])
      )

      window.dispatchEvent(
        new Event('nexus-notifications-updated')
      )
    } catch (error) {
      console.error('Unable to save notification:', error)
    }
  }

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus-projects')
      return saved ? JSON.parse(saved) : initialProjects
    } catch {
      return initialProjects
    }
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
  localStorage.setItem('nexus-projects', JSON.stringify(projects))
  window.dispatchEvent(new Event('nexus-data-updated'))
}, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.category.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Completed' && project.progress === 100) ||
        (filter === 'In Progress' && project.progress < 100)

      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])

  const completedCount = projects.filter(
    (project) => project.progress === 100
  ).length

  const handleCreateProject = (e) => {
    e.preventDefault()

    if (!form.name.trim()) return

    const newProject = {
      ...form,
      id: Date.now(),
      progress: 0,
    }

    setProjects((current) => [newProject, ...current])
    addNotification(`New project created: ${newProject.name}`)
    setForm(emptyForm)
    setIsModalOpen(false)
  }

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        const deletedProject = projects.find((project) => project.id === id)
if (deletedProject) {
  addNotification(`Project deleted: ${deletedProject.name}`)
}
      setProjects((current) =>
        current.filter((project) => project.id !== id)
      )
    }
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Workspace / Projects
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your projects and track your team's progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Create Project
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Projects', value: projects.length, icon: FolderKanban },
          { label: 'In Progress', value: projects.filter(p => p.progress < 100).length, icon: Clock3 },
          { label: 'Completed', value: completedCount, icon: CheckCircle2 },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <Icon size={20} className="text-blue-600" />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'In Progress', 'Completed'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                filter === item
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Project cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[project.color] || colorStyles.blue}`}>
                  <FolderKanban size={22} />
                </div>

                <button
                  onClick={() => handleDeleteProject(project.id)}
                  aria-label={`Delete ${project.name}`}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${project.progress === 100 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                    {project.progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {project.category}
                </span>

                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarDays size={14} />
                  {project.dueDate
                    ? new Date(`${project.dueDate}T00:00:00`).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })
                    : 'No deadline'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
          <FolderKanban size={35} className="mx-auto text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
            No projects found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try another search or create a new project.
          </p>
        </div>
      )}

      {/* Create project modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Project
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Website Redesign"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Research</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
