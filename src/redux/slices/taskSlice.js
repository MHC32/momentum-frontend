// frontend/src/redux/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import taskService from '../../services/taskService'

const initialState = {
  tasks: [],
  kanban: {
    todo: [],
    'in-progress': [],
    done: []
  },
  currentTask: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Get all tasks
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (filters, thunkAPI) => {
    try {
      return await taskService.getTasks(filters)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get project kanban
export const getProjectKanban = createAsyncThunk(
  'tasks/getKanban',
  async (projectId, thunkAPI) => {
    try {
      return await taskService.getProjectKanban(projectId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await taskService.updateTask(id, data)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update task status (Kanban drag & drop)
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await taskService.updateTaskStatus(id, status)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    clearCurrentTask: (state) => {
      state.currentTask = null
    },
    
    // 🆕 NOUVEAU : Actions pour sync temps réel via Socket.IO
    updateTaskInStore: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(t => t._id === updatedTask._id);
      
      if (index !== -1) {
        // Mettre à jour task existante
        state.tasks[index] = updatedTask;
        
        // Mettre à jour dans kanban aussi
        Object.keys(state.kanban).forEach(status => {
          const kanbanIndex = state.kanban[status].findIndex(t => t._id === updatedTask._id);
          if (kanbanIndex !== -1) {
            state.kanban[status][kanbanIndex] = updatedTask;
          }
        });
        
        // Si status a changé, déplacer dans le bon kanban
        if (state.tasks[index].status !== updatedTask.status) {
          // Retirer de l'ancien
          Object.keys(state.kanban).forEach(status => {
            state.kanban[status] = state.kanban[status].filter(t => t._id !== updatedTask._id);
          });
          // Ajouter au nouveau
          if (state.kanban[updatedTask.status]) {
            state.kanban[updatedTask.status].push(updatedTask);
          }
        }
      } else {
        // Ajouter nouvelle task (si créée depuis autre onglet/appareil)
        state.tasks.unshift(updatedTask);
        if (state.kanban[updatedTask.status]) {
          state.kanban[updatedTask.status].unshift(updatedTask);
        }
      }
    },
    
    removeTaskFromStore: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(t => t._id !== taskId);
      
      // Retirer du kanban aussi
      Object.keys(state.kanban).forEach(status => {
        state.kanban[status] = state.kanban[status].filter(t => t._id !== taskId);
      });
    },
    
    // Optimistic update for drag & drop
    moveTask: (state, action) => {
      const { taskId, fromStatus, toStatus } = action.payload
      
      // Remove from old column
      if (state.kanban[fromStatus]) {
        state.kanban[fromStatus] = state.kanban[fromStatus].filter(t => t._id !== taskId)
      }
      
      // Add to new column
      const task = state.tasks.find(t => t._id === taskId)
      if (task && state.kanban[toStatus]) {
        task.status = toStatus
        state.kanban[toStatus].push(task)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = action.payload.data
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get kanban
      .addCase(getProjectKanban.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProjectKanban.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.kanban = action.payload.data.kanban
        state.tasks = [
          ...action.payload.data.kanban.todo,
          ...action.payload.data.kanban['in-progress'],
          ...action.payload.data.kanban.done
        ]
      })
      .addCase(getProjectKanban.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks.unshift(action.payload.data)
        
        // Add to kanban
        const status = action.payload.data.status
        if (state.kanban[status]) {
          state.kanban[status].unshift(action.payload.data)
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        
        const index = state.tasks.findIndex(t => t._id === action.payload.data._id)
        if (index !== -1) {
          state.tasks[index] = action.payload.data
        }
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        
        const task = action.payload.data
        const index = state.tasks.findIndex(t => t._id === task._id)
        if (index !== -1) {
          state.tasks[index] = task
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        
        state.tasks = state.tasks.filter(t => t._id !== action.payload)
        
        // Remove from kanban
        Object.keys(state.kanban).forEach(status => {
          state.kanban[status] = state.kanban[status].filter(t => t._id !== action.payload)
        })
      })
  },
})

export const { reset, clearCurrentTask, moveTask, updateTaskInStore, removeTaskFromStore } = taskSlice.actions
export default taskSlice.reducer