import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../../services/goalService';

// State initial
const initialState = {
  // Objectifs hiérarchiques (Objectifs 2026)
  hierarchyGoals: [],
  
  // Objectifs checklist (Objectifs Perso)
  checklistGoals: [],
  
  // Objectif actuellement sélectionné
  currentGoal: null,
  
  // Filtres pour la vue hiérarchique
  hierarchyFilters: {
    level: 'annual', // annual, quarterly, monthly, weekly, daily
    category: null,  // financial, professional, learning, personal, health
    year: new Date().getFullYear()
  },
  
  // Stats
  stats: null,
  
  // États de chargement
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  
  // Erreurs
  error: null,
  
  // Messages de succès
  successMessage: null
};

// ==================== ASYNC THUNKS ====================

/**
 * Obtenir tous les objectifs avec filtres
 */
export const getGoals = createAsyncThunk(
  'goals/getGoals',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.getGoals(filters, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Obtenir un objectif par ID
 */
export const getGoalById = createAsyncThunk(
  'goals/getGoalById',
  async (goalId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.getGoalById(goalId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Créer un nouvel objectif
 */
export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.createGoal(goalData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Mettre à jour un objectif
 */
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ goalId, goalData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.updateGoal(goalId, goalData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Supprimer un objectif
 */
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.deleteGoal(goalId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Mettre à jour la progression
 */
export const updateProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ goalId, progressData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.updateProgress(goalId, progressData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Compléter une étape
 */
export const completeStep = createAsyncThunk(
  'goals/completeStep',
  async ({ goalId, stepId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.completeStep(goalId, stepId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Recalculer depuis les enfants
 */
export const recalculateFromChildren = createAsyncThunk(
  'goals/recalculateFromChildren',
  async (goalId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.recalculateFromChildren(goalId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Synchroniser les commits
 */
export const syncCommitsGoal = createAsyncThunk(
  'goals/syncCommitsGoal',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.syncCommitsGoal(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Synchroniser les livres
 */
export const syncBookGoal = createAsyncThunk(
  'goals/syncBookGoal',
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.syncBookGoal(projectId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Obtenir les stats
 */
export const getGoalsStats = createAsyncThunk(
  'goals/getGoalsStats',
  async (filters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await goalService.getGoalsStats(filters, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==================== SLICE ====================

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    // Réinitialiser l'état
    reset: (state) => {
      state.hierarchyGoals = [];
      state.checklistGoals = [];
      state.currentGoal = null;
      state.stats = null;
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.successMessage = null;
    },
    
    // Changer le niveau hiérarchique
    setHierarchyLevel: (state, action) => {
      state.hierarchyFilters.level = action.payload;
    },
    
    // Changer la catégorie
    setHierarchyCategory: (state, action) => {
      state.hierarchyFilters.category = action.payload;
    },
    
    // Changer l'année
    setHierarchyYear: (state, action) => {
      state.hierarchyFilters.year = action.payload;
    },
    
    // Effacer l'objectif actuel
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
    
    // Effacer les messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // ==================== SOCKET.IO EVENTS ====================
    
    // Objectif créé (temps réel)
    goalCreatedRealtime: (state, action) => {
      const goal = action.payload.goal;
      
      if (goal.display_in_hierarchy) {
        state.hierarchyGoals.unshift(goal);
      }
      
      if (goal.display_in_checklist) {
        state.checklistGoals.unshift(goal);
      }
    },
    
    // Objectif mis à jour (temps réel)
    goalUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload.goal;
      
      // Mettre à jour dans hierarchyGoals
      const hierarchyIndex = state.hierarchyGoals.findIndex(
        g => g._id === updatedGoal._id
      );
      if (hierarchyIndex !== -1) {
        state.hierarchyGoals[hierarchyIndex] = updatedGoal;
      }
      
      // Mettre à jour dans checklistGoals
      const checklistIndex = state.checklistGoals.findIndex(
        g => g._id === updatedGoal._id
      );
      if (checklistIndex !== -1) {
        state.checklistGoals[checklistIndex] = updatedGoal;
      }
      
      // Mettre à jour currentGoal si c'est le même
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal;
      }
    },
    
    // Objectif supprimé (temps réel)
    goalDeletedRealtime: (state, action) => {
      const goalId = action.payload.goalId;
      
      state.hierarchyGoals = state.hierarchyGoals.filter(g => g._id !== goalId);
      state.checklistGoals = state.checklistGoals.filter(g => g._id !== goalId);
      
      if (state.currentGoal?._id === goalId) {
        state.currentGoal = null;
      }
    },
    
    // Progression mise à jour (temps réel)
    goalProgressUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload.goal;
      
      // Même logique que goalUpdatedRealtime
      const hierarchyIndex = state.hierarchyGoals.findIndex(
        g => g._id === updatedGoal._id
      );
      if (hierarchyIndex !== -1) {
        state.hierarchyGoals[hierarchyIndex] = updatedGoal;
      }
      
      const checklistIndex = state.checklistGoals.findIndex(
        g => g._id === updatedGoal._id
      );
      if (checklistIndex !== -1) {
        state.checklistGoals[checklistIndex] = updatedGoal;
      }
      
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal;
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // ==================== GET GOALS ====================
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        const goals = action.payload.data.goals;
        
        // Séparer selon display_in_*
        state.hierarchyGoals = goals.filter(g => g.display_in_hierarchy);
        state.checklistGoals = goals.filter(g => g.display_in_checklist);
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ==================== GET GOAL BY ID ====================
      .addCase(getGoalById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGoal = action.payload.data.goal;
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // ==================== CREATE GOAL ====================
      .addCase(createGoal.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isCreating = false;
        const goal = action.payload.data.goal;
        
        // Ajouter dans la liste appropriée
        if (goal.display_in_hierarchy) {
          state.hierarchyGoals.unshift(goal);
        }
        
        if (goal.display_in_checklist) {
          state.checklistGoals.unshift(goal);
        }
        
        state.successMessage = action.payload.message;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // ==================== UPDATE GOAL ====================
      .addCase(updateGoal.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedGoal = action.payload.data.goal;
        
        // Mettre à jour dans hierarchyGoals
        const hierarchyIndex = state.hierarchyGoals.findIndex(
          g => g._id === updatedGoal._id
        );
        if (hierarchyIndex !== -1) {
          state.hierarchyGoals[hierarchyIndex] = updatedGoal;
        }
        
        // Mettre à jour dans checklistGoals
        const checklistIndex = state.checklistGoals.findIndex(
          g => g._id === updatedGoal._id
        );
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updatedGoal;
        }
        
        if (state.currentGoal?._id === updatedGoal._id) {
          state.currentGoal = updatedGoal;
        }
        
        state.successMessage = action.payload.message;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // ==================== DELETE GOAL ====================
      .addCase(deleteGoal.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isDeleting = false;
        const goalId = action.meta.arg;
        
        state.hierarchyGoals = state.hierarchyGoals.filter(g => g._id !== goalId);
        state.checklistGoals = state.checklistGoals.filter(g => g._id !== goalId);
        
        if (state.currentGoal?._id === goalId) {
          state.currentGoal = null;
        }
        
        state.successMessage = action.payload.message;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      
      // ==================== UPDATE PROGRESS ====================
      .addCase(updateProgress.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedGoal = action.payload.data.goal;
        
        // Mettre à jour dans les listes
        const hierarchyIndex = state.hierarchyGoals.findIndex(
          g => g._id === updatedGoal._id
        );
        if (hierarchyIndex !== -1) {
          state.hierarchyGoals[hierarchyIndex] = updatedGoal;
        }
        
        const checklistIndex = state.checklistGoals.findIndex(
          g => g._id === updatedGoal._id
        );
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updatedGoal;
        }
        
        if (state.currentGoal?._id === updatedGoal._id) {
          state.currentGoal = updatedGoal;
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // ==================== COMPLETE STEP ====================
      .addCase(completeStep.fulfilled, (state, action) => {
        const updatedGoal = action.payload.data.goal;
        
        const checklistIndex = state.checklistGoals.findIndex(
          g => g._id === updatedGoal._id
        );
        if (checklistIndex !== -1) {
          state.checklistGoals[checklistIndex] = updatedGoal;
        }
        
        if (state.currentGoal?._id === updatedGoal._id) {
          state.currentGoal = updatedGoal;
        }
      })
      
      // ==================== GET STATS ====================
      .addCase(getGoalsStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

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
} = goalSlice.actions;

export default goalSlice.reducer;