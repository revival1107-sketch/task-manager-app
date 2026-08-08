import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-gray-400">
        아직 업무가 없습니다. 위에서 새 업무를 추가해 보세요.
      </p>
    )
  }
  return (
    <ul className="mt-4 divide-y divide-gray-100">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
