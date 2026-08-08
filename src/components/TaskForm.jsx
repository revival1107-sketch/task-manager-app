import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function TaskForm({ onAdd }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name, content)
    setName('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="업무 이름..."
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#3c4043] dark:bg-[#292a2d] dark:text-gray-100"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="설명 (선택)"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#3c4043] dark:bg-[#292a2d] dark:text-gray-100"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="flex items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        <Plus size={16} /> 추가
      </button>
    </form>
  )
}
