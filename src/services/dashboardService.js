// frontend/src/services/dashboardService.js
import api from '../utils/axios'

// Get complete dashboard data
const getDashboard = async () => {
  const response = await api.get('/dashboard')
  return response.data
}

// Get focus tasks only
const getFocusTasks = async () => {
  const response = await api.get('/dashboard/focus')
  return response.data
}

// Get recent activity only
const getRecentActivity = async (limit = 10) => {
  const response = await api.get(`/dashboard/activity?limit=${limit}`)
  return response.data
}

const dashboardService = {
  getDashboard,
  getFocusTasks,
  getRecentActivity,
}

export default dashboardService