import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour les cookies
})

// Request interceptor - Ajoute le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Gère les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si le token est expiré (401) et qu'on n'a pas encore retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Supprimer le token et rediriger vers login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Rediriger vers login
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api