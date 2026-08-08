import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function MilestoneForm({ onAdd }) {
  const [date, setDate] = useState('')
  const [target, setTarget] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    onAdd({ date, target, content })
    setDate('')
    setTarget('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap gap-1.5">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="대상"
        className="w-24 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="마일스톤 내용"
        className="min-w-[8rem] flex-1 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="flex items-center gap-1 rounded border border-blue-200 px-2 py-1 text-xs text-blue-600 disabled:opacity-40"
      >
        <Plus size={12} /> 마일스톤 추가
      </button>
    </form>
  )
}
