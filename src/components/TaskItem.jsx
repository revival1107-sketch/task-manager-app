import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.title) onEdit(task.id, trimmed)
    else setDraft(task.title)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraft(task.title)
      setIsEditing(false)
    }
  }

  return (
    <li className="flex items-center gap-2 py-2">
      <button type="button" onClick={() => onToggle(task)} aria-label="완료 토글">
        {task.is_complete ? (
          <CheckCircle2 className="text-blue-600" size={20} />
        ) : (
          <Circle className="text-gray-300" size={20} />
        )}
      </button>

      {isEditing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded border border-blue-300 px-2 py-1 text-sm"
        />
      ) : (
        <span
          className={`flex-1 text-sm ${task.is_complete ? 'text-gray-400 line-through' : 'text-gray-900'}`}
        >
          {task.title}
        </span>
      )}

      <button type="button" onClick={() => setIsEditing(true)} aria-label="수정">
        <Pencil size={16} className="text-gray-400 hover:text-blue-600" />
      </button>
      <button
        type="button"
        onClick={() => window.confirm('이 업무를 삭제할까요?') && onDelete(task.id)}
        aria-label="삭제"
      >
        <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
      </button>
    </li>
  )
}
