
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  CalendarDays,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
} from 'lucide-react'

const initialTasks = [
  {
    id: 1,
    title: 'Design homepage',
    description: 'Create a modern homepage layout.',
    project: 'Website Redesign',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-11-02',
  },
  {
    id: 2,
    title: 'Build login page',
    description: 'Implement the login page UI.',
    project: 'Mobile Application',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-11-04',
  },
  {
    id: 3,
    title: 'Review app prototype',
    description: 'Check the prototype and suggest improvements.',
    project: 'Mobile Application',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-11-05',
  },
  {
    id: 4,
    title: 'Create campaign banner',
    description: 'Prepare the marketing campaign banner.',
    project: 'Marketing Campaign',
    priority: 'Low',
    status: 'Done',
    dueDate: '2026-10-28',
  },
  {
    id: 5,
    title: 'Update dashboard cards',
    description: 'Improve dashboard card responsiveness.',
    project: 'Dashboard UI',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2026-11-06',
  },
]

const columns = [
  { id: 'Todo', title: 'To Do', icon: Circle },
  { id: 'In Progress', title: 'In Progress', icon: Clock3 },
  { id: 'Done', title: 'Done', icon: CheckCircle2 },
]

const emptyForm = {
  title: '',
  description: '',
  project: '',
  priority: 'Medium',
  status: 'Todo',
  dueDate: '',
}

const priorityStyles = {
  High: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  Medium: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  Low: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
}

export default function Tasks() {
      const addNotification = (message) => {
    let notifications = []

    try {
      notifications = JSON.parse(
        localStorage.getItem('nexus-notifications') || '[]'
      )
    } catch {
      notifications = []
    }

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

    window.dispatchEvent(new Event('nexus-notifications-updated'))
  }
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus-tasks')
      return saved ? JSON.parse(saved) : initialTasks
    } catch {
      return initialTasks
    }
  })

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

 useEffect(() => {
  localStorage.setItem('nexus-tasks', JSON.stringify(tasks))
  window.dispatchEvent(new Event('nexus-data-updated'))
}, [tasks])

useEffect(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  let notifications = []

  try {
    notifications = JSON.parse(
      localStorage.getItem('nexus-notifications') || '[]'
    )
  } catch {
    notifications = []
  }

  const reminders = []

  tasks.forEach((task) => {
    if (!task.dueDate || task.status === 'Done') return

    const dueDate = new Date(`${task.dueDate}T00:00:00`)
    if (Number.isNaN(dueDate.getTime())) return

    let message = ''

    if (dueDate.getTime() < today.getTime()) {
      message = `Overdue task: ${task.title}`
    } else if (dueDate.getTime() === today.getTime()) {
      message = `Task due today: ${task.title}`
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      message = `Task due tomorrow: ${task.title}`
    }

    if (message) {
      const alreadyExists = notifications.some(
        (notification) =>
          notification.message === message &&
          new Date(notification.time).toDateString() === today.toDateString()
      )

      if (!alreadyExists) {
        reminders.push({
          id: Date.now() + reminders.length,
          message,
          time: new Date().toISOString(),
          read: false,
        })
      }
    }
  })

  if (reminders.length > 0) {
    const updated = [...reminders, ...notifications]

    localStorage.setItem(
      'nexus-notifications',
      JSON.stringify(updated)
    )

    window.dispatchEvent(new Event('nexus-notifications-updated'))
  }
}, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      `${task.title} ${task.project} ${task.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [tasks, search])

  const handleCreateTask = (e) => {
    e.preventDefault()

    if (!form.title.trim()) return

        const newTask = { ...form, id: Date.now() }

    setTasks((current) => [newTask, ...current])

    addNotification(`New task created: ${newTask.title}`)

    setForm(emptyForm)
    setIsModalOpen(false)
  }

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((current) => current.filter((task) => task.id !== id))
    }
  }

    const handleStatusChange = (id, status) => {
    const task = tasks.find((item) => item.id === id)

    if (!task || task.status === status) return

    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    )

    if (status === 'Done') {
      addNotification(`Task completed: ${task.title}`)
    } else {
      addNotification(`Task moved to ${status}: ${task.title}`)
    }
  }

  const totalCompleted = tasks.filter(
    (task) => task.status === 'Done'
  ).length

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Workspace / My Tasks
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            My Tasks
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Organize your work and keep track of your progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
        >
          <Plus size={19} />
          Add New Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: ListTodo },
          {
            label: 'In Progress',
            value: tasks.filter((task) => task.status === 'In Progress').length,
            icon: Clock3,
          },
          { label: 'Completed', value: totalCompleted, icon: CheckCircle2 },
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

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        {columns.map((column) => {
          const Icon = column.icon
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.id
          )

          return (
            <section
              key={column.id}
              className="min-w-0 rounded-2xl bg-gray-100/80 p-4 dark:bg-gray-900/70"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    size={19}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setForm({ ...emptyForm, status: column.id })
                    setIsModalOpen(true)
                  }}
                  aria-label={`Add task to ${column.title}`}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white dark:hover:bg-gray-800"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task, index) => (
                    <motion.article
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            priorityStyles[task.priority] || priorityStyles.Medium
                          }`}
                        >
                          {task.priority}
                        </span>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        {task.description || 'No description provided.'}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                        <span className="max-w-[55%] truncate text-xs text-gray-500 dark:text-gray-400">
                          {task.project || 'General'}
                        </span>

                        <span className="flex shrink-0 items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarDays size={13} />
                          {task.dueDate
                            ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : 'No date'}
                        </span>
                      </div>

                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Move task
                        </label>

                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <option value="Todo">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-400">
                      No tasks here yet
                    </p>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* Create task modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Task
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a task to your workspace.
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

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Design homepage"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe this task..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  placeholder="e.g. Website Redesign"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
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
                    className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-2 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
