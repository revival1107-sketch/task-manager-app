import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('is_complete', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(async (title) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ title: trimmed })
        .select()
        .single()
      if (error) throw error
      setTasks((prev) => [data, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const toggleTask = useCallback(
    async (task) => {
      const nextValue = !task.is_complete
      setError(null)
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_complete: nextValue } : t))
      )
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ is_complete: nextValue, updated_at: new Date().toISOString() })
          .eq('id', task.id)
        if (error) throw error
      } catch (err) {
        setError(err.message)
        fetchTasks()
      }
    },
    [fetchTasks]
  )

  const editTask = useCallback(
    async (id, title) => {
      const trimmed = title.trim()
      if (!trimmed) return
      setError(null)
      const updatedAt = new Date().toISOString()
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: trimmed, updated_at: updatedAt } : t))
      )
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ title: trimmed, updated_at: updatedAt })
          .eq('id', id)
        if (error) throw error
      } catch (err) {
        setError(err.message)
        fetchTasks()
      }
    },
    [fetchTasks]
  )

  const deleteTask = useCallback(
    async (id) => {
      setError(null)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      try {
        const { error } = await supabase.from('tasks').delete().eq('id', id)
        if (error) throw error
      } catch (err) {
        setError(err.message)
        fetchTasks()
      }
    },
    [fetchTasks]
  )

  return { tasks, loading, error, addTask, toggleTask, editTask, deleteTask }
}
