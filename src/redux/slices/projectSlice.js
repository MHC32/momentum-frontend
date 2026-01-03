import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import projectService from '../../services/projectService'

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Get all projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (filters, thunkAPI) => {
    try {
      return await projectService.getProjects(filters)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single project
export const getProject = createAsyncThunk(
  'projects/getOne',
  async (id, thunkAPI) => {
    try {
      return await projectService.getProject(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, thunkAPI) => {
    try {
      return await projectService.createProject(projectData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, data)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, thunkAPI) => {
    try {
      await projectService.deleteProject(id)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = action.payload.data
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get single project
      .addCase(getProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentProject = action.payload.data
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects.unshift(action.payload.data)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const index = state.projects.findIndex(p => p._id === action.payload.data._id)
        if (index !== -1) {
          state.projects[index] = action.payload.data
        }
        if (state.currentProject?._id === action.payload.data._id) {
          state.currentProject = action.payload.data
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = state.projects.filter(p => p._id !== action.payload)
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearCurrentProject } = projectSlice.actions
export default projectSlice.reducer