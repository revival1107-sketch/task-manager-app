import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 업무 입력..."
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        <Plus size={16} /> 추가
      </button>
    </form>
  )
}
