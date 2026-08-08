import { Sun, Moon, Monitor } from 'lucide-react'

const OPTIONS = [
  { value: 'light', label: 'Bright', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function ThemeToggle({ theme, onChange }) {
  return (
    <div className="mb-4 inline-flex rounded-md border border-gray-200 p-0.5 dark:border-[#3c4043]">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-label={`테마: ${label}`}
          className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            theme === value
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#3c4043]'
          }`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}
