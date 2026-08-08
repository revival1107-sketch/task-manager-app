import { Loader2, LogOut, UserX } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import AuthForm from './components/AuthForm'
import ThemeToggle from './components/ThemeToggle'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut, deleteAccount } = useAuth()
  const { theme, setTheme } = useTheme()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400 dark:text-gray-500">
        <Loader2 className="animate-spin" size={24} />
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />
  }

  return (
    <TaskDashboard
      user={user}
      onSignOut={signOut}
      onDeleteAccount={deleteAccount}
      theme={theme}
      onThemeChange={setTheme}
    />
  )
}

function TaskDashboard({ user, onSignOut, onDeleteAccount, theme, onThemeChange }) {
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

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        '정말 회원 탈퇴하시겠습니까? 모든 업무와 마일스톤이 영구적으로 삭제되며 되돌릴 수 없습니다.'
      )
    ) {
      return
    }
    try {
      await onDeleteAccount()
    } catch (err) {
      window.alert(`탈퇴 처리 중 문제가 발생했습니다: ${err.message}`)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-300">📅 업무 관리</h1>
          {tasks.length > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {completedCount} / {tasks.length} 완료
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="max-w-[10rem] truncate text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
            >
              <LogOut size={12} /> 로그아웃
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
            >
              <UserX size={12} /> 회원 탈퇴
            </button>
          </div>
        </div>
      </header>

      <ThemeToggle theme={theme} onChange={onThemeChange} />

      <TaskForm onAdd={addTask} />

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          문제가 발생했습니다: {error}
        </p>
      )}

      {loading && tasks.length === 0 ? (
        <div className="mt-8 flex justify-center text-gray-400 dark:text-gray-500">
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
