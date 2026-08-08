import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import MilestoneList from './MilestoneList'
import MilestoneForm from './MilestoneForm'
import {
  getUrgencyLevel,
  nearestIncompleteMilestone,
  latestMilestoneDate,
  formatMonthDay,
  URGENCY_DOT_CLASS,
} from '../milestoneUtils'

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
  const latestDate = latestMilestoneDate(task.milestones)

  return (
    <li className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-[#3c4043] dark:bg-[#292a2d]">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggle(task)}
          aria-label="업무 완료 토글"
          className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
            task.is_completed
              ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
              : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-[#3c4043] dark:text-gray-500 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-400'
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
                className="rounded border border-blue-300 px-2 py-1 text-sm font-medium dark:border-blue-700 dark:bg-[#202124] dark:text-gray-100"
              />
              <input
                value={draft.content}
                onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="rounded border border-blue-300 px-2 py-1 text-xs text-gray-500 dark:border-blue-700 dark:bg-[#202124] dark:text-gray-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={commitEdit}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft({ name: task.name, content: task.content })
                    setIsEditing(false)
                  }}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-sm font-medium ${task.is_completed ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-300'}`}
              >
                {task.name}
                {latestDate && (
                  <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
                    ({formatMonthDay(latestDate)})
                  </span>
                )}
              </p>
              {task.content && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{task.content}</p>
              )}
            </>
          )}
          {task.milestones.length > 0 && (
            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
              마일스톤 {doneCount}/{task.milestones.length} 완료
            </p>
          )}
          {!expanded && !task.is_completed && nearest && (
            <div className="mt-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 dark:bg-[#202124]">
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-300">
                {nearestUrgency && (
                  <span className={`h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT_CLASS[nearestUrgency]}`} />
                )}
                가장 가까운 일정: {formatMonthDay(nearest.date)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {nearest.target && `${nearest.target} · `}
                {nearest.content}
              </p>
            </div>
          )}
        </div>

        <button type="button" onClick={() => setIsEditing(true)} aria-label="업무 수정" className="shrink-0">
          <Pencil size={16} className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400" />
        </button>
        <button
          type="button"
          onClick={() => window.confirm('이 업무를 삭제할까요? 마일스톤도 함께 삭제됩니다.') && onDelete(task.id)}
          aria-label="업무 삭제"
          className="shrink-0"
        >
          <Trash2 size={16} className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="마일스톤 펼치기/접기"
          className="shrink-0"
        >
          {expanded ? (
            <ChevronUp size={16} className="text-gray-300 dark:text-gray-600" />
          ) : (
            <ChevronDown size={16} className="text-gray-300 dark:text-gray-600" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="ml-7 mt-1 border-l border-gray-100 pl-3 dark:border-[#3c4043]">
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
