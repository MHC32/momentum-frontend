import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from '../../services/goalService'

const initialState = {
  hierarchyGoals: [],
  checklistGoals: [],
  currentGoal: null,
  hierarchyFilters: {
    level: 'annual',
    category: null,
    year: 2026
  },
  stats: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isError: false,
  isSuccess: false,
  error: null,
  successMessage: null
}

// ==================== THUNKS ASYNC ====================

// Get all goals
export const getGoals = createAsyncThunk(
  'goals/getAll',
  async (filters, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getGoals thunk - START');
      console.log('   filters:', filters);
      
      const response = await goalService.getGoals(filters);
      
      console.log('✅ [goalSlice] getGoals thunk - SUCCESS');
      console.log('   response:', response);
      console.log('   response.data:', response.data);
      
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getGoals thunk - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Create goal
export const createGoal = createAsyncThunk(
  'goals/create',
  async (goalData, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] createGoal thunk - START');
      console.log('   goalData:', goalData);
      
      const response = await goalService.createGoal(goalData);
      
      console.log('✅ [goalSlice] createGoal thunk - SUCCESS');
      console.log('   response:', response);
      console.log('   response.data:', response.data);
      console.log('   response.data.goal:', response.data?.goal);
      
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] createGoal thunk - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Update goal
export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ goalId, goalData }, thunkAPI) => {
    try {
      return await goalService.updateGoal(goalId, goalData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete goal
export const deleteGoal = createAsyncThunk(
  'goals/delete',
  async (goalId, thunkAPI) => {
    try {
      await goalService.deleteGoal(goalId)
      return goalId
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update progress
export const updateProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ goalId, progressData }, thunkAPI) => {
    try {
      return await goalService.updateProgress(goalId, progressData)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Complete step
export const completeStep = createAsyncThunk(
  'goals/completeStep',
  async ({ goalId, stepId }, thunkAPI) => {
    try {
      return await goalService.completeStep(goalId, stepId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single goal
export const getGoalById = createAsyncThunk(
  'goals/getOne',
  async (goalId, thunkAPI) => {
    try {
      return await goalService.getGoalById(goalId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Recalculate from children
export const recalculateFromChildren = createAsyncThunk(
  'goals/recalculate',
  async (goalId, thunkAPI) => {
    try {
      return await goalService.recalculateFromChildren(goalId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Sync commits goal
export const syncCommitsGoal = createAsyncThunk(
  'goals/syncCommits',
  async (_, thunkAPI) => {
    try {
      return await goalService.syncCommitsGoal()
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Sync book goal
export const syncBookGoal = createAsyncThunk(
  'goals/syncBook',
  async (projectId, thunkAPI) => {
    try {
      return await goalService.syncBookGoal(projectId)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get goals stats
export const getGoalsStats = createAsyncThunk(
  'goals/getStats',
  async (filters, thunkAPI) => {
    try {
      return await goalService.getGoalsStats(filters)
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ==================== SLICE ====================

export const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isCreating = false
      state.isUpdating = false
      state.isDeleting = false
      state.isError = false
      state.isSuccess = false
      state.error = null
      state.successMessage = null
    },
    setHierarchyLevel: (state, action) => {
      console.log('🔄 [goalSlice] setHierarchyLevel reducer');
      console.log('   Old level:', state.hierarchyFilters.level);
      console.log('   New level:', action.payload);
      
      state.hierarchyFilters.level = action.payload;
      
      console.log('   Updated state.hierarchyFilters:', state.hierarchyFilters);
    },
    setHierarchyCategory: (state, action) => {
      state.hierarchyFilters.category = action.payload
    },
    setHierarchyYear: (state, action) => {
      state.hierarchyFilters.year = action.payload
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null
    },
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    // Socket.IO real-time updates
    goalCreatedRealtime: (state, action) => {
      const goal = action.payload?.goal || action.payload
      if (goal.display_in_hierarchy) {
        state.hierarchyGoals.unshift(goal)
      }
      if (goal.display_in_checklist) {
        state.checklistGoals.unshift(goal)
      }
    },
    goalUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload?.goal || action.payload
      
      const hierarchyIndex = state.hierarchyGoals.findIndex(g => g._id === updatedGoal._id)
      if (hierarchyIndex !== -1) {
        state.hierarchyGoals[hierarchyIndex] = updatedGoal
      }
      
      const checklistIndex = state.checklistGoals.findIndex(g => g._id === updatedGoal._id)
      if (checklistIndex !== -1) {
        state.checklistGoals[checklistIndex] = updatedGoal
      }
      
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal
      }
    },
    goalDeletedRealtime: (state, action) => {
      const goalId = action.payload
      state.hierarchyGoals = state.hierarchyGoals.filter(g => g._id !== goalId)
      state.checklistGoals = state.checklistGoals.filter(g => g._id !== goalId)
      if (state.currentGoal?._id === goalId) {
        state.currentGoal = null
      }
    },
    goalProgressUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload?.goal || action.payload
      
      const hierarchyIndex = state.hierarchyGoals.findIndex(g => g._id === updatedGoal._id)
      if (hierarchyIndex !== -1) {
        state.hierarchyGoals[hierarchyIndex] = updatedGoal
      }
      
      const checklistIndex = state.checklistGoals.findIndex(g => g._id === updatedGoal._id)
      if (checklistIndex !== -1) {
        state.checklistGoals[checklistIndex] = updatedGoal
      }
      
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get goals
      .addCase(getGoals.pending, (state) => {
        console.log('⏳ [goalSlice] getGoals.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getGoals.fulfilled');
        console.log('   action.payload:', action.payload);
        console.log('   action.meta.arg:', action.meta.arg);
        
        state.isLoading = false;
        state.isSuccess = true;
        
        // S'assurer que goals est toujours un array
        const rawGoals = action.payload.data?.goals || action.payload.data?.data || action.payload.data || action.payload || [];
        console.log('   rawGoals:', rawGoals);
        console.log('   rawGoals type:', typeof rawGoals);
        console.log('   rawGoals isArray:', Array.isArray(rawGoals));
        
        const goals = Array.isArray(rawGoals) ? rawGoals : [];
        console.log('   goals (after isArray check):', goals);
        console.log('   goals.length:', goals.length);
        
        // Séparer selon display_in_hierarchy et display_in_checklist
        if (action.meta.arg?.display_in_hierarchy) {
          console.log('   Setting hierarchyGoals:', goals.length, 'goals');
          state.hierarchyGoals = goals;
        }
        if (action.meta.arg?.display_in_checklist) {
          console.log('   Setting checklistGoals:', goals.length, 'goals');
          state.checklistGoals = goals;
        }
        if (!action.meta.arg?.display_in_hierarchy && !action.meta.arg?.display_in_checklist) {
          state.hierarchyGoals = goals.filter(g => g.display_in_hierarchy);
          state.checklistGoals = goals.filter(g => g.display_in_checklist);
        }
        
        console.log('   Final state.hierarchyGoals.length:', state.hierarchyGoals.length);
        console.log('   Final state.checklistGoals.length:', state.checklistGoals.length);
      })
      .addCase(getGoals.rejected, (state, action) => {
        console.error('❌ [goalSlice] getGoals.rejected');
        console.error('   error:', action.payload);
        
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Get single goal
      .addCase(getGoalById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentGoal = action.payload.data?.goal || action.payload.data
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.error = action.payload
      })
      
      // Create goal
      .addCase(createGoal.pending, (state) => {
        console.log('⏳ [goalSlice] createGoal.pending');
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] createGoal.fulfilled');
        console.log('   action.payload:', action.payload);
        console.log('   action.payload.data:', action.payload.data);
        
        state.isCreating = false;
        state.isSuccess = true;
        state.successMessage = 'Objectif créé avec succès';
        
        // Extraire le goal
        const newGoal = action.payload.data?.goal || action.payload.data;
        console.log('   newGoal:', newGoal);
        console.log('   newGoal.display_in_hierarchy:', newGoal?.display_in_hierarchy);
        console.log('   newGoal.display_in_checklist:', newGoal?.display_in_checklist);
        
        if (newGoal && newGoal.display_in_hierarchy) {
          console.log('   Adding to hierarchyGoals');
          state.hierarchyGoals.unshift(newGoal);
          console.log('   New hierarchyGoals.length:', state.hierarchyGoals.length);
        }
        if (newGoal && newGoal.display_in_checklist) {
          console.log('   Adding to checklistGoals');
          state.checklistGoals.unshift(newGoal);
        }
      })
      .addCase(createGoal.rejected, (state, action) => {
        console.error('❌ [goalSlice] createGoal.rejected');
        console.error('   error:', action.payload);
        
        state.isCreating = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isUpdating = false
        state.isSuccess = true
        state.successMessage = 'Objectif mis à jour'
        
        const updated = action.payload.data?.goal || action.payload.data
        
        const hierarchyIndex = state.hierarchyGoals.findIndex(g => g._id === updated._id)
        if (hierarchyIndex !== -1) {
          state.hierarchyGoals[hierarchyIndex] = updated
        }
        
        const checklistIndex = state.checklistGoals.findIndex(g => g._id === updated._id)
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updated
        }
        
        if (state.currentGoal?._id === updated._id) {
          state.currentGoal = updated
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isUpdating = false
        state.isError = true
        state.error = action.payload
      })
      
      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.isDeleting = true
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isDeleting = false
        state.isSuccess = true
        state.successMessage = 'Objectif supprimé'
        
        const deletedId = action.payload
        state.hierarchyGoals = state.hierarchyGoals.filter(g => g._id !== deletedId)
        state.checklistGoals = state.checklistGoals.filter(g => g._id !== deletedId)
        
        if (state.currentGoal?._id === deletedId) {
          state.currentGoal = null
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isDeleting = false
        state.isError = true
        state.error = action.payload
      })
      
      // Update progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        const updated = action.payload.data?.goal || action.payload.data
        
        const hierarchyIndex = state.hierarchyGoals.findIndex(g => g._id === updated._id)
        if (hierarchyIndex !== -1) {
          state.hierarchyGoals[hierarchyIndex] = updated
        }
        
        const checklistIndex = state.checklistGoals.findIndex(g => g._id === updated._id)
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updated
        }
      })
      
      // Complete step
      .addCase(completeStep.fulfilled, (state, action) => {
        const updated = action.payload.data?.goal || action.payload.data
        
        const checklistIndex = state.checklistGoals.findIndex(g => g._id === updated._id)
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updated
        }
      })
      
      // Get stats
      .addCase(getGoalsStats.fulfilled, (state, action) => {
        state.stats = action.payload.data?.stats || action.payload.data
      })
  }
})

export const {
  reset,
  setHierarchyLevel,
  setHierarchyCategory,
  setHierarchyYear,
  clearCurrentGoal,
  clearMessages,
  goalCreatedRealtime,
  goalUpdatedRealtime,
  goalDeletedRealtime,
  goalProgressUpdatedRealtime
} = goalSlice.actions

export default goalSlice.reducer