import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'

export default function MilestoneItem({ milestone, isCurrent, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    date: milestone.date,
    target: milestone.target,
    content: milestone.content,
  })

  function commitEdit() {
    const trimmedContent = draft.content.trim()
    if (!trimmedContent) {
      setDraft({ date: milestone.date, target: milestone.target, content: milestone.content })
      setIsEditing(false)
      return
    }
    onEdit({ date: draft.date, target: draft.target.trim(), content: trimmedContent })
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraft({ date: milestone.date, target: milestone.target, content: milestone.content })
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <li className="flex flex-wrap items-center gap-1.5 rounded bg-blue-50 px-2 py-1.5">
        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="rounded border border-blue-300 px-1.5 py-1 text-xs"
        />
        <input
          value={draft.target}
          onChange={(e) => setDraft((d) => ({ ...d, target: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="w-24 rounded border border-blue-300 px-1.5 py-1 text-xs"
        />
        <input
          autoFocus
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 rounded border border-blue-300 px-1.5 py-1 text-xs"
        />
      </li>
    )
  }

  return (
    <li className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${isCurrent ? 'bg-blue-50' : ''}`}>
      <button type="button" onClick={onToggle} aria-label="마일스톤 완료 토글">
        {milestone.completed ? (
          <CheckCircle2 className="text-blue-600" size={16} />
        ) : (
          <Circle className="text-gray-300" size={16} />
        )}
      </button>
      <span className="w-20 shrink-0 text-gray-400">{milestone.date || '날짜 없음'}</span>
      {milestone.target && (
        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">{milestone.target}</span>
      )}
      <span className={`flex-1 ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
        {milestone.content}
      </span>
      {isCurrent && !milestone.completed && (
        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600">
          진행중
        </span>
      )}
      <button type="button" onClick={() => setIsEditing(true)} aria-label="마일스톤 수정">
        <Pencil size={12} className="text-gray-300 hover:text-blue-600" />
      </button>
      <button type="button" onClick={onDelete} aria-label="마일스톤 삭제">
        <Trash2 size={12} className="text-gray-300 hover:text-red-600" />
      </button>
    </li>
  )
}
