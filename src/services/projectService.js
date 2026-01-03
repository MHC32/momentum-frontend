import api from '../utils/axios'

// Get all projects
const getProjects = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await api.get(`/projects?${params}`)
  return response.data
}

// Get single project
const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`)
  return response.data
}

// Create project
const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData)
  return response.data
}

// Update project
const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data)
  return response.data
}

// Delete project
const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
}

export default projectService