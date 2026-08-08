import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

function firstIncompleteIndex(milestones) {
  const idx = milestones.findIndex((m) => !m.completed)
  return idx === -1 ? milestones.length : idx
}

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
        .order('is_completed', { ascending: true })
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

  const addTask = useCallback(async (name, content) => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ name: trimmedName, content: content.trim(), milestones: [], is_completed: false, current_milestone_index: 0 })
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
      const nextValue = !task.is_completed
      setError(null)
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, is_completed: nextValue } : t)))
      try {
        const { error } = await supabase.from('tasks').update({ is_completed: nextValue }).eq('id', task.id)
        if (error) throw error
      } catch (err) {
        setError(err.message)
        fetchTasks()
      }
    },
    [fetchTasks]
  )

  const editTask = useCallback(
    async (id, { name, content }) => {
      const trimmedName = name.trim()
      if (!trimmedName) return
      setError(null)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, name: trimmedName, content } : t)))
      try {
        const { error } = await supabase.from('tasks').update({ name: trimmedName, content }).eq('id', id)
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

  // Shared by every milestone mutation: recompute current_milestone_index,
  // apply optimistically, persist, and resync on failure.
  const updateMilestones = useCallback(
    async (task, newMilestones) => {
      const newIndex = firstIncompleteIndex(newMilestones)
      setError(null)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, milestones: newMilestones, current_milestone_index: newIndex } : t
        )
      )
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ milestones: newMilestones, current_milestone_index: newIndex })
          .eq('id', task.id)
        if (error) throw error
      } catch (err) {
        setError(err.message)
        fetchTasks()
      }
    },
    [fetchTasks]
  )

  const addMilestone = useCallback(
    (task, { date, target, content }) => {
      const trimmedContent = content.trim()
      if (!trimmedContent) return
      const newMilestone = {
        id: String(Date.now()),
        date,
        target: target.trim(),
        content: trimmedContent,
        completed: false,
      }
      return updateMilestones(task, [...task.milestones, newMilestone])
    },
    [updateMilestones]
  )

  const toggleMilestone = useCallback(
    (task, milestoneId) => {
      const newMilestones = task.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      )
      return updateMilestones(task, newMilestones)
    },
    [updateMilestones]
  )

  const editMilestone = useCallback(
    (task, milestoneId, fields) => {
      const newMilestones = task.milestones.map((m) => (m.id === milestoneId ? { ...m, ...fields } : m))
      return updateMilestones(task, newMilestones)
    },
    [updateMilestones]
  )

  const deleteMilestone = useCallback(
    (task, milestoneId) => {
      const newMilestones = task.milestones.filter((m) => m.id !== milestoneId)
      return updateMilestones(task, newMilestones)
    },
    [updateMilestones]
  )

  return {
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
  }
}
