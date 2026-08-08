import { Loader2, LogOut } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import AuthForm from './components/AuthForm'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />
  }

  return <TaskDashboard user={user} onSignOut={signOut} />
}

function TaskDashboard({ user, onSignOut }) {
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
      <header className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">📅 업무 관리</h1>
          {tasks.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {completedCount} / {tasks.length} 완료
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="max-w-[10rem] truncate text-xs text-gray-400">{user.email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-red-600"
          >
            <LogOut size={12} /> 로그아웃
          </button>
        </div>
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
