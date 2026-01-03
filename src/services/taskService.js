import api from '../utils/axios'

// Get all tasks
const getTasks = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/tasks?${params}`)
  return response.data
}

// Get project kanban
const getProjectKanban = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}/kanban`)
  return response.data
}

// Get single task
const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`)
  return response.data
}

// Create task
const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData)
  return response.data
}

// Update task
const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data)
  return response.data
}

// Update task status
const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status })
  return response.data
}

// Delete task
const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}

// Add Git commit
const addGitCommit = async (id, commitData) => {
  const response = await api.post(`/tasks/${id}/commits`, commitData)
  return response.data
}

const taskService = {
  getTasks,
  getProjectKanban,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addGitCommit,
}

export default taskService