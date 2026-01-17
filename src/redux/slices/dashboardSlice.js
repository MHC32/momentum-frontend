// frontend/src/redux/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardService from '../../services/dashboardService'

const initialState = {
  dashboardData: null,
  focusTasks: [],
  stats: null,
  projects: [],
  recentActivity: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Get complete dashboard
export const getDashboard = createAsyncThunk(
  'dashboard/getAll',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboard()
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get focus tasks only
export const getFocusTasks = createAsyncThunk(
  'dashboard/getFocus',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getFocusTasks()
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get recent activity only
export const getRecentActivity = createAsyncThunk(
  'dashboard/getActivity',
  async (limit = 10, thunkAPI) => {
    try {
      return await dashboardService.getRecentActivity(limit)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    clearDashboard: (state) => {
      state.dashboardData = null
      state.focusTasks = []
      state.stats = null
      state.projects = []
      state.recentActivity = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard
      .addCase(getDashboard.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.dashboardData = action.payload.data
        state.focusTasks = action.payload.data.focus.tasks || []
        state.stats = action.payload.data.stats
        state.projects = action.payload.data.projects || []
        state.recentActivity = action.payload.data.recentActivity || []
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get focus tasks
      .addCase(getFocusTasks.fulfilled, (state, action) => {
        state.focusTasks = action.payload.data || []
      })
      // Get recent activity
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload.data || []
      })
  },
})

export const { reset, clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer