import MilestoneItem from './MilestoneItem'

export default function MilestoneList({ task, onToggle, onEdit, onDelete }) {
  if (task.milestones.length === 0) {
    return <p className="mt-2 text-xs text-gray-300">아직 마일스톤이 없습니다.</p>
  }
  return (
    <ul className="mt-2 space-y-0.5">
      {task.milestones.map((milestone, index) => (
        <MilestoneItem
          key={milestone.id}
          milestone={milestone}
          isCurrent={index === task.current_milestone_index}
          onToggle={() => onToggle(task, milestone.id)}
          onEdit={(fields) => onEdit(task, milestone.id, fields)}
          onDelete={() => onDelete(task, milestone.id)}
        />
      ))}
    </ul>
  )
}
