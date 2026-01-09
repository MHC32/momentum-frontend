import api from '../utils/axios'

// ==================== CRUD DE BASE ====================

// Create goal
const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData)
  return response.data
}

// Get all goals
const getGoals = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/goals?${params}`)
  return response.data
}

// Get single goal
const getGoalById = async (goalId) => {
  const response = await api.get(`/goals/${goalId}`)
  return response.data
}

// Update goal
const updateGoal = async (goalId, goalData) => {
  const response = await api.put(`/goals/${goalId}`, goalData)
  return response.data
}

// Delete goal
const deleteGoal = async (goalId) => {
  const response = await api.delete(`/goals/${goalId}`)
  return response.data
}

// ==================== PROGRESSION ====================

// Update progress
const updateProgress = async (goalId, progressData) => {
  const response = await api.put(`/goals/${goalId}/progress`, progressData)
  return response.data
}

// Complete/uncomplete step
const completeStep = async (goalId, stepId) => {
  const response = await api.put(`/goals/${goalId}/steps/${stepId}/complete`, {})
  return response.data
}

// Recalculate from children
const recalculateFromChildren = async (goalId) => {
  const response = await api.post(`/goals/${goalId}/recalculate`, {})
  return response.data
}

// ==================== INTEGRATIONS ====================

// Sync commits goal
const syncCommitsGoal = async () => {
  const response = await api.post('/goals/sync-commits', {})
  return response.data
}

// Sync book goal
const syncBookGoal = async (projectId) => {
  const response = await api.post(`/goals/sync-book/${projectId}`, {})
  return response.data
}

// ==================== STATS ====================

// Get goals stats
const getGoalsStats = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/goals/stats/summary?${params}`)
  return response.data
}

const goalService = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateProgress,
  completeStep,
  recalculateFromChildren,
  syncCommitsGoal,
  syncBookGoal,
  getGoalsStats
}

export default goalService