import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import MilestoneList from './MilestoneList'
import MilestoneForm from './MilestoneForm'
import { getUrgencyLevel, nearestIncompleteMilestone, URGENCY_DOT_CLASS } from '../milestoneUtils'

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAddMilestone,
  onToggleMilestone,
  onEditMilestone,
  onDeleteMilestone,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({ name: task.name, content: task.content })
  const [expanded, setExpanded] = useState(true)

  function commitEdit() {
    const trimmedName = draft.name.trim()
    if (!trimmedName) {
      setDraft({ name: task.name, content: task.content })
      setIsEditing(false)
      return
    }
    onEdit(task.id, { name: trimmedName, content: draft.content.trim() })
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setDraft({ name: task.name, content: task.content })
      setIsEditing(false)
    }
  }

  const doneCount = task.milestones.filter((m) => m.completed).length
  const nearest = nearestIncompleteMilestone(task.milestones)
  const nearestUrgency = nearest ? getUrgencyLevel(nearest.date) : null

  return (
    <li className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggle(task)}
          aria-label="업무 완료 토글"
          className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
            task.is_completed
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          {task.is_completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          {task.is_completed ? '완료됨' : '완료'}
        </button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-1.5">
              <input
                autoFocus
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="rounded border border-blue-300 px-2 py-1 text-sm font-medium"
              />
              <input
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="rounded border border-blue-300 px-2 py-1 text-xs text-gray-500"
              />
              <div className="flex gap-2">
                <button type="button" onClick={commitEdit} className="text-xs font-medium text-blue-600">
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ name: task.name, content: task.content })
                    setIsEditing(false)
                  }}
                  className="text-xs text-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-sm font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.name}
              </p>
              {task.content && <p className="mt-0.5 text-xs text-gray-500">{task.content}</p>}
            </>
          )}
          {task.milestones.length > 0 && (
            <p className="mt-1 text-[11px] text-gray-400">
              마일스톤 {doneCount}/{task.milestones.length} 완료
            </p>
          )}
          {!expanded && nearest && (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
              {nearestUrgency && (
                <span className={`h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT_CLASS[nearestUrgency]}`} />
              )}
              가장 가까운 일정: {nearest.date}
              {nearest.target && ` · ${nearest.target}`} · {nearest.content}
            </p>
          )}
        </div>

        <button type="button" onClick={() => setIsEditing(true)} aria-label="업무 수정" className="shrink-0">
          <Pencil size={16} className="text-gray-400 hover:text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => window.confirm('이 업무를 삭제할까요? 마일스톤도 함께 삭제됩니다.') && onDelete(task.id)}
          aria-label="업무 삭제"
          className="shrink-0"
        >
          <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="마일스톤 펼치기/접기"
          className="shrink-0"
        >
          {expanded ? (
            <ChevronUp size={16} className="text-gray-300" />
          ) : (
            <ChevronDown size={16} className="text-gray-300" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="ml-7 mt-1 border-l border-gray-100 pl-3">
          <MilestoneList
            task={task}
            onToggle={onToggleMilestone}
            onEdit={onEditMilestone}
            onDelete={onDeleteMilestone}
          />
          <MilestoneForm onAdd={(fields) => onAddMilestone(task, fields)} />
        </div>
      )}
    </li>
  )
}
