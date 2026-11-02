
import { Zap } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
        <Zap size={20} fill="currentColor" />
      </div>

      <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Nexus<span className="text-blue-600">.</span>
      </span>
    </div>
  )
}
