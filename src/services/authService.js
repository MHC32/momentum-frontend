import axios from 'axios'

const API_URL = '/api/auth/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('token', response.data.token)
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('token', response.data.token)
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const authService = {
  register,
  login,
  logout,
}

export default authService