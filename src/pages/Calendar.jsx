
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  X,
  CheckCircle2,
  FolderKanban,
  Clock3,
} from 'lucide-react'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const emptyTask = {
  title: '',
  description: '',
  project: '',
  priority: 'Medium',
  status: 'Todo',
  dueDate: '',
}

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()))
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexus-tasks')) || []
    } catch {
      return []
    }
  })
  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexus-projects')) || []
    } catch {
      return []
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    ...emptyTask,
    dueDate: getDateKey(new Date()),
  })

  useEffect(() => {
  localStorage.setItem('nexus-tasks', JSON.stringify(tasks))

  window.dispatchEvent(new Event('nexus-data-updated'))
}, [tasks])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday is the first day of the week.
    const startOffset = (firstDay.getDay() + 6) % 7
    const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7

    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(year, month, index - startOffset + 1)

      return {
        date,
        key: getDateKey(date),
        isCurrentMonth: date.getMonth() === month,
      }
    })
  }, [year, month])

  const events = useMemo(() => {
    return [
      ...tasks
        .filter((task) => task.dueDate)
        .map((task) => ({
          id: `task-${task.id}`,
          title: task.title,
          date: task.dueDate,
          type: 'task',
          status: task.status,
        })),

      ...projects
        .filter((project) => project.dueDate)
        .map((project) => ({
          id: `project-${project.id}`,
          title: project.name,
          date: project.dueDate,
          type: 'project',
          status: project.progress === 100 ? 'Done' : 'In Progress',
        })),
    ]
  }, [tasks, projects])

  const selectedEvents = events.filter(
    (event) => event.date === selectedDate
  )

  const today = getDateKey(new Date())

  const changeMonth = (direction) => {
    setCurrentDate((current) =>
      new Date(current.getFullYear(), current.getMonth() + direction, 1)
    )
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(now)
    setSelectedDate(getDateKey(now))
  }

  const handleCreateTask = (e) => {
    e.preventDefault()

    if (!form.title.trim() || !form.dueDate) return

    const newTask = {
      ...form,
      id: Date.now(),
    }

    setTasks((current) => [newTask, ...current])
    setSelectedDate(form.dueDate)
    setCurrentDate(new Date(`${form.dueDate}T00:00:00`))
    setForm({ ...emptyTask, dueDate: form.dueDate })
    setIsModalOpen(false)
  }

  const openTaskModal = () => {
    setForm({ ...emptyTask, dueDate: selectedDate })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Workspace / Calendar
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Keep track of project deadlines and upcoming tasks.
          </p>
        </div>

        <button
          onClick={openTaskModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Add Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Total Events',
            value: events.length,
            icon: CalendarDays,
          },
          {
            label: 'Tasks',
            value: events.filter((event) => event.type === 'task').length,
            icon: CheckCircle2,
          },
          {
            label: 'Project Deadlines',
            value: events.filter((event) => event.type === 'project').length,
            icon: FolderKanban,
          },
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

      {/* Calendar and selected date panel */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
          {/* Month navigation */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthName}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Today
              </button>

              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="pb-3 text-center text-xs font-semibold text-gray-400 sm:text-sm"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const dayEvents = events.filter(
                (event) => event.date === day.key
              )

              const isSelected = selectedDate === day.key
              const isToday = today === day.key

              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDate(day.key)}
                  className={`flex min-h-[75px] min-w-0 flex-col items-center rounded-xl border p-1.5 transition sm:min-h-[105px] sm:p-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                  } ${!day.isCurrentMonth ? 'opacity-35' : ''}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>

                  <div className="mt-1 flex w-full flex-col gap-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        key={event.id}
                        className={`w-full truncate rounded px-1 py-0.5 text-[9px] sm:text-[10px] ${
                          event.type === 'task'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                        }`}
                      >
                        {event.title}
                      </span>
                    ))}

                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-gray-500">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-5 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Tasks
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              Project deadlines
            </div>
          </div>
        </div>

        {/* Selected date events */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected date
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                  'en-US',
                  { day: 'numeric', month: 'long' }
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <CalendarDays size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {event.type === 'task' ? (
                      <Clock3 size={16} className="text-blue-600" />
                    ) : (
                      <FolderKanban size={16} className="text-purple-600" />
                    )}

                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {event.type === 'task' ? 'Task' : 'Project deadline'}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {event.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
                <CalendarDays
                  size={28}
                  className="mx-auto text-gray-400"
                />
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  No events scheduled
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Select another date or add a task.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={openTaskModal}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-500/30 dark:hover:bg-blue-500/10"
          >
            <Plus size={17} />
            Add task for this date
          </button>
        </div>
      </div>

      {/* Add task modal */}
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
                  Add Calendar Task
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create a task with a deadline.
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
                  Task title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Review project design"
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
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe your task..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due date *
                </label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
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
                  Save Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
