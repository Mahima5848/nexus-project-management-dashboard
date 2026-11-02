
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Users,
  Mail,
  MoreHorizontal,
  Trash2,
  X,
  BriefcaseBusiness,
  ShieldCheck,
} from 'lucide-react'

const initialMembers = [
  {
    id: 1,
    name: 'Mahima Kushwaha',
    email: 'mahima@example.com',
    role: 'Admin',
    department: 'Development',
    initials: 'MK',
    color: 'blue',
  },
  {
    id: 2,
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'Developer',
    department: 'Engineering',
    initials: 'AM',
    color: 'purple',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'Designer',
    department: 'Design',
    initials: 'SC',
    color: 'pink',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Developer',
    department: 'Engineering',
    initials: 'DW',
    color: 'orange',
  },
  {
    id: 5,
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Manager',
    department: 'Operations',
    initials: 'ED',
    color: 'green',
  },
]

const avatarStyles = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
}

const emptyForm = {
  name: '',
  email: '',
  role: 'Developer',
  department: 'Engineering',
}

export default function Team() {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus-team')
      return saved ? JSON.parse(saved) : initialMembers
    } catch {
      return initialMembers
    }
  })

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
  localStorage.setItem('nexus-team', JSON.stringify(members))

  window.dispatchEvent(new Event('nexus-data-updated'))
}, [members])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        `${member.name} ${member.email} ${member.department}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesRole =
        roleFilter === 'All' || member.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [members, search, roleFilter])

  const handleInvite = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim()) return

    const nameParts = form.name.trim().split(/\s+/)

    const newMember = {
      ...form,
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      initials: nameParts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      color: 'blue',
    }

    setMembers((current) => [newMember, ...current])
    setForm(emptyForm)
    setIsModalOpen(false)
  }

  const handleRemove = (id) => {
    if (window.confirm('Remove this team member?')) {
      setMembers((current) =>
        current.filter((member) => member.id !== id)
      )
    }
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Workspace / Team
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Team Members
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your workspace members and their roles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Invite Member
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Members', value: members.length, icon: Users },
          {
            label: 'Developers',
            value: members.filter((m) => m.role === 'Developer').length,
            icon: BriefcaseBusiness,
          },
          {
            label: 'Admins',
            value: members.filter((m) => m.role === 'Admin').length,
            icon: ShieldCheck,
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
            placeholder="Search team members..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
        </select>
      </div>

      {/* Members grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ${avatarStyles[member.color] || avatarStyles.blue}`}>
                  {member.initials}
                </div>

                <button
                  onClick={() => handleRemove(member.id)}
                  aria-label={`Remove ${member.name}`}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>

                <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {member.role}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail size={16} />
                  <span className="truncate">{member.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <BriefcaseBusiness size={16} />
                  {member.department}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
          <Users size={35} className="mx-auto text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
            No team members found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try another search or invite a new member.
          </p>
        </div>
      )}

      {/* Invite modal */}
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
                  Invite Team Member
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a member to your workspace.
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

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. John Smith"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Engineering</option>
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Operations</option>
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
                  Add Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
