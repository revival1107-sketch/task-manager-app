import { useState } from 'react'

export default function AuthForm({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        await onSignIn(email, password)
      } else {
        const data = await onSignUp(email, password)
        if (!data.session) {
          setInfo('가입 확인 이메일을 보냈습니다. 메일함을 확인한 뒤 로그인해주세요.')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function toggleMode() {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    setError(null)
    setInfo(null)
  }

  return (
    <div className="mx-auto mt-20 max-w-sm px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">📅 업무 관리</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
      >
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {mode === 'signin' ? '로그인' : '회원가입'}
        </h2>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {info && <p className="text-xs text-blue-600 dark:text-blue-400">{info}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {mode === 'signin' ? '로그인' : '가입하기'}
        </button>
        <button
          type="button"
          onClick={toggleMode}
          className="text-xs text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
        >
          {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>
      </form>
    </div>
  )
}
