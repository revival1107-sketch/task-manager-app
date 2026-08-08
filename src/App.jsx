import { Loader2 } from 'lucide-react'
import { useTasks } from './hooks/useTasks'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

export default function App() {
  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    addMilestone,
    toggleMilestone,
    editMilestone,
    deleteMilestone,
  } = useTasks()
  const completedCount = tasks.filter((t) => t.is_completed).length

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">📅 업무 관리 센터</h1>
        {tasks.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {completedCount} / {tasks.length} 완료
          </p>
        )}
      </header>

      <TaskForm onAdd={addTask} />

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          문제가 발생했습니다: {error}
        </p>
      )}

      {loading && tasks.length === 0 ? (
        <div className="mt-8 flex justify-center text-gray-400">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={deleteTask}
          onAddMilestone={addMilestone}
          onToggleMilestone={toggleMilestone}
          onEditMilestone={editMilestone}
          onDeleteMilestone={deleteMilestone}
        />
      )}
    </div>
  )
}
