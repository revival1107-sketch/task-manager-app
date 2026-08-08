import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'
import { getUrgencyLevel, URGENCY_DOT_CLASS, URGENCY_LABEL } from '../milestoneUtils'

export default function MilestoneItem({ milestone, isCurrent, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const urgency = !milestone.completed ? getUrgencyLevel(milestone.date) : null
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
      <li className="flex flex-wrap items-center gap-1.5 rounded bg-blue-50 px-2 py-1.5 dark:bg-blue-950/40">
        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="rounded border border-blue-300 px-1.5 py-1 text-xs dark:border-blue-700 dark:bg-[#202124] dark:text-gray-300"
        />
        <input
          value={draft.target}
          onChange={(e) => setDraft((d) => ({ ...d, target: e.target.value }))}
          onKeyDown={handleKeyDown}
          className="w-24 rounded border border-blue-300 px-1.5 py-1 text-xs dark:border-blue-700 dark:bg-[#202124] dark:text-gray-100"
        />
        <input
          autoFocus
          value={draft.content}
          onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 rounded border border-blue-300 px-1.5 py-1 text-xs dark:border-blue-700 dark:bg-[#202124] dark:text-gray-100"
        />
      </li>
    )
  }

  return (
    <li
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded px-2 py-1.5 text-xs ${isCurrent ? 'bg-gray-100 dark:bg-white/5' : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label="마일스톤 완료 토글"
        className={`flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
          milestone.completed
            ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
            : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-[#3c4043] dark:text-gray-500 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-400'
        }`}
      >
        {milestone.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
        {milestone.completed ? '완료됨' : '완료'}
      </button>
      <span className="flex shrink-0 items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {urgency && (
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT_CLASS[urgency]}`}
            title={URGENCY_LABEL[urgency]}
          />
        )}
        {milestone.date || '날짜 없음'}
      </span>
      {milestone.target && (
        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-gray-500 dark:bg-[#3c4043] dark:text-gray-300">
          {milestone.target}
        </span>
      )}
      <span
        className={`min-w-[6rem] flex-1 ${milestone.completed ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
      >
        {milestone.content}
      </span>
      {isCurrent && !milestone.completed && (
        <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-[#3c4043] dark:text-gray-300">
          진행중
        </span>
      )}
      <span className="ml-auto flex shrink-0 items-center gap-1">
        <button type="button" onClick={() => setIsEditing(true)} aria-label="마일스톤 수정" title="수정">
          <Pencil size={12} className="text-gray-300 hover:text-blue-600 dark:text-gray-600 dark:hover:text-blue-400" />
        </button>
        <button type="button" onClick={onDelete} aria-label="마일스톤 삭제" title="삭제">
          <Trash2 size={12} className="text-gray-300 hover:text-red-600 dark:text-gray-600 dark:hover:text-red-400" />
        </button>
      </span>
    </li>
  )
}
