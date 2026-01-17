import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from '../../services/goalService'

/**
 * COMMIT: refactor(goals): Restructure Redux state for hierarchical views V2
 * 
 * Restructure l'état Redux pour supporter les vues hiérarchiques:
 * - Ajoute annualGoals, quarterlyGoals, monthlyGoals, weeklyGoals, dailyGoals
 * - Ajoute focusGoals pour le "Focus du jour"
 * - Ajoute personalGoals pour les objectifs personnels
 * - Garde hierarchyGoals et checklistGoals pour compatibilité
 */

// 🆕 Helper pour formater les données agrégées de l'API
// Remplacer la fonction formatAggregatedWeeklyGoals par cette version améliorée :
const formatAggregatedWeeklyGoals = (apiData) => {
  console.log('🔄 formatAggregatedWeeklyGoals - Input:', apiData);
  
  // Si l'API renvoie déjà les données agrégées correctement
  if (apiData && apiData.goals && Array.isArray(apiData.goals)) {
    console.log('📦 API returned aggregated goals:', apiData.goals.length);
    
    // Vérifier la structure des données
    return apiData.goals.map(goal => {
      // S'assurer que la structure est correcte
      const weekTarget = goal.weekTarget || goal.target_value || goal.target || 0;
      const currentWeekValue = goal.currentWeekValue || goal.current_value || goal.current || 0;
      const unit = goal.unit || 'default';
      
      // 🆕 Générer un titre convivial
      let title = goal.title;
      if (!title) {
        if (unit === 'commits') {
          title = `${weekTarget} commits GitHub`;
        } else if (unit === '€') {
          title = `${weekTarget.toLocaleString()} €`;
        } else {
          title = `${weekTarget} ${unit}`;
        }
      }
      
      const formattedGoal = {
        id: goal.id || goal._id || `${unit}_week_${apiData.week || 1}_${Date.now()}`,
        _id: goal._id || goal.id, // 🆕 Toujours inclure _id
        title: title,
        currentWeekValue: currentWeekValue,
        weekTarget: weekTarget,
        unit: unit,
        dailyData: goal.dailyData || []
      };
      
      console.log(`  Formatted: ${formattedGoal.title} (${formattedGoal.currentWeekValue}/${formattedGoal.weekTarget})`);
      return formattedGoal;
    });
  }
  
  // Fallback: Si l'API retourne des objectifs individuels, les agréger nous-mêmes
  console.warn('⚠️ API returned individual goals, attempting to aggregate manually');
  
  // D'abord, trouver tous les objectifs
  let individualGoals = [];
  
  if (apiData && apiData.goals && Array.isArray(apiData.goals)) {
    individualGoals = apiData.goals;
  } else if (apiData && Array.isArray(apiData)) {
    individualGoals = apiData;
  } else if (apiData && apiData.data && Array.isArray(apiData.data.goals)) {
    individualGoals = apiData.data.goals;
  }
  
  if (individualGoals.length === 0) {
    console.log('❌ No individual goals found to aggregate');
    return [];
  }
  
  console.log(`Found ${individualGoals.length} individual goals to aggregate`);
  
  // Regrouper par unité
  const goalsByUnit = {};
  
  individualGoals.forEach(goal => {
    const unit = goal.unit || 'default';
    
    if (!goalsByUnit[unit]) {
      // 🆕 Déterminer le titre selon l'unité
      let title = '';
      if (unit === 'commits') {
        title = 'commits GitHub';
      } else if (unit === '€') {
        title = 'Épargne';
      } else {
        title = unit;
      }
      
      goalsByUnit[unit] = {
        id: `${unit}_week_${apiData.week || 1}_aggregated`,
        _id: `${unit}_week_${apiData.week || 1}_aggregated`,
        title: title,
        currentWeekValue: 0,
        weekTarget: 0,
        unit: unit,
        dailyData: [] // 🆕 À remplir plus tard si disponible
      };
    }
    
    // Ajouter les valeurs
    goalsByUnit[unit].currentWeekValue += goal.current_value || 0;
    goalsByUnit[unit].weekTarget += goal.target_value || 0;
    
    console.log(`  Added ${goal.title}: ${goal.current_value || 0}/${goal.target_value || 0} ${unit}`);
  });
  
  const aggregatedGoals = Object.values(goalsByUnit);
  console.log(`Aggregated into ${aggregatedGoals.length} goal types:`, aggregatedGoals);
  
  return aggregatedGoals;
};
const initialState = {
  // Nouvelles vues V2
  annualGoals: [],
  quarterlyGoals: [],
  monthlyGoals: [],
  weeklyGoals: [], // 🆕 Contiendra les objectifs AGRÉGÉS par type
  dailyGoals: [],
  focusGoals: [], // Focus du jour
  personalGoals: [],
  
  // Anciennes vues (compatibilité)
  hierarchyGoals: [],
  checklistGoals: [],
  
  // Goal actuellement affiché
  currentGoal: null,
  
  // Filtres hiérarchie
  hierarchyFilters: {
    level: 'annual',
    category: null,
    year: new Date().getFullYear(),
    quarter: null,
    month: null,
    week: null,
    date: null
  },
  
  // Metadata des vues - MODIFIÉ POUR weekly
  viewMetadata: {
    annual: { count: 0, goalsByCategory: {} },
    quarterly: { quarter: 1, breakdown: 0, personal: 0 },
    monthly: { month: 1, monthName: '', tasksCount: 0 },
    weekly: { 
      week: 1, 
      weekStart: null, 
      weekEnd: null,
      personalGoals: [], // 🆕 Ajouté pour stocker les objectifs personnels
      breakdown: 0,
      personal: 0
    },
    daily: { date: null, dateFormatted: '', focusProgress: 0 }
  },
  
  // Stats
  stats: null,
  
  // États de chargement
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isError: false,
  isSuccess: false,
  error: null,
  successMessage: null
}

// ==================== THUNKS ASYNC - VUES HIÉRARCHIQUES V2 ====================

/**
 * COMMIT: feat(goals): Add Redux thunks for hierarchical views
 * 
 * Ajoute les thunks pour récupérer les objectifs selon différentes vues
 */

// Get annual goals
export const getAnnualGoals = createAsyncThunk(
  'goals/getAnnual',
  async (filters, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getAnnualGoals thunk - START', filters);
      const response = await goalService.getAnnualGoals(filters);
      console.log('✅ [goalSlice] getAnnualGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getAnnualGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Get quarterly goals
export const getQuarterlyGoals = createAsyncThunk(
  'goals/getQuarterly',
  async ({ quarter, filters }, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getQuarterlyGoals thunk - START', { quarter, filters });
      const response = await goalService.getQuarterlyGoals(quarter, filters);
      console.log('✅ [goalSlice] getQuarterlyGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getQuarterlyGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Get monthly goals
export const getMonthlyGoals = createAsyncThunk(
  'goals/getMonthly',
  async ({ month, filters }, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getMonthlyGoals thunk - START', { month, filters });
      const response = await goalService.getMonthlyGoals(month, filters);
      console.log('✅ [goalSlice] getMonthlyGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getMonthlyGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Get weekly goals - 🆕 RETOURNE DES DONNÉES AGRÉGÉES
export const getWeeklyGoals = createAsyncThunk(
  'goals/getWeekly',
  async ({ week, filters }, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getWeeklyGoals thunk - START', { week, filters });
      const response = await goalService.getWeeklyGoals(week, filters);
      console.log('✅ [goalSlice] getWeeklyGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getWeeklyGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Get daily goals + Focus du jour
export const getDailyGoals = createAsyncThunk(
  'goals/getDaily',
  async (filters, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getDailyGoals thunk - START', filters);
      const response = await goalService.getDailyGoals(filters);
      console.log('✅ [goalSlice] getDailyGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getDailyGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// Get personal goals
export const getPersonalGoals = createAsyncThunk(
  'goals/getPersonal',
  async (filters, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getPersonalGoals thunk - START', filters);
      const response = await goalService.getPersonalGoals(filters);
      console.log('✅ [goalSlice] getPersonalGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getPersonalGoals - ERROR:', error);
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
)

// ==================== THUNKS ASYNC - ANCIENNES MÉTHODES ====================

// Get all goals (ANCIENNE MÉTHODE - gardée pour compatibilité)
export const getGoals = createAsyncThunk(
  'goals/getAll',
  async (filters, thunkAPI) => {
    try {
      console.log('📡 [goalSlice] getGoals thunk - START', filters);
      const response = await goalService.getGoals(filters);
      console.log('✅ [goalSlice] getGoals - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] getGoals - ERROR:', error);
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
      console.log('📡 [goalSlice] createGoal thunk - START', goalData);
      const response = await goalService.createGoal(goalData);
      console.log('✅ [goalSlice] createGoal - SUCCESS', response);
      return response;
    } catch (error) {
      console.error('❌ [goalSlice] createGoal - ERROR:', error);
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
    
    /**
     * COMMIT: feat(goals): Add filter actions for hierarchical navigation
     * 
     * Ajoute les actions pour gérer la navigation entre les vues
     */
    setHierarchyLevel: (state, action) => {
      console.log('🔄 [goalSlice] setHierarchyLevel', action.payload);
      state.hierarchyFilters.level = action.payload;
    },
    setHierarchyCategory: (state, action) => {
      state.hierarchyFilters.category = action.payload
    },
    setHierarchyYear: (state, action) => {
      state.hierarchyFilters.year = action.payload
    },
    setHierarchyQuarter: (state, action) => {
      state.hierarchyFilters.quarter = action.payload
    },
    setHierarchyMonth: (state, action) => {
      state.hierarchyFilters.month = action.payload
    },
    setHierarchyWeek: (state, action) => {
      state.hierarchyFilters.week = action.payload
    },
    setHierarchyDate: (state, action) => {
      state.hierarchyFilters.date = action.payload
    },
    
    clearCurrentGoal: (state) => {
      state.currentGoal = null
    },
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
    
    /**
     * COMMIT: feat(goals): Add real-time Socket.IO updates
     * 
     * Ajoute les reducers pour gérer les mises à jour temps réel
     */
    goalCreatedRealtime: (state, action) => {
      const goal = action.payload?.goal || action.payload
      
      // Ajouter dans les vues appropriées selon le level
      if (goal.level === 'annual') state.annualGoals.unshift(goal)
      if (goal.level === 'quarterly') state.quarterlyGoals.unshift(goal)
      if (goal.level === 'monthly') state.monthlyGoals.unshift(goal)
      if (goal.level === 'weekly') state.weeklyGoals.unshift(goal)
      if (goal.level === 'daily') state.dailyGoals.unshift(goal)
      if (goal.is_personal) state.personalGoals.unshift(goal)
      
      // Anciennes vues (compatibilité)
      if (goal.display_in_hierarchy) state.hierarchyGoals.unshift(goal)
      if (goal.display_in_checklist) state.checklistGoals.unshift(goal)
    },
    
    goalUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload?.goal || action.payload
      
      // Mettre à jour dans toutes les vues concernées
      const updateInArray = (array) => {
        const index = array.findIndex(g => g._id === updatedGoal._id)
        if (index !== -1) array[index] = updatedGoal
      }
      
      updateInArray(state.annualGoals)
      updateInArray(state.quarterlyGoals)
      updateInArray(state.monthlyGoals)
      updateInArray(state.weeklyGoals)
      updateInArray(state.dailyGoals)
      updateInArray(state.focusGoals)
      updateInArray(state.personalGoals)
      updateInArray(state.hierarchyGoals)
      updateInArray(state.checklistGoals)
      
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal
      }
    },
    
    goalDeletedRealtime: (state, action) => {
      const goalId = action.payload
      
      state.annualGoals = state.annualGoals.filter(g => g._id !== goalId)
      state.quarterlyGoals = state.quarterlyGoals.filter(g => g._id !== goalId)
      state.monthlyGoals = state.monthlyGoals.filter(g => g._id !== goalId)
      state.weeklyGoals = state.weeklyGoals.filter(g => g._id !== goalId)
      state.dailyGoals = state.dailyGoals.filter(g => g._id !== goalId)
      state.focusGoals = state.focusGoals.filter(g => g._id !== goalId)
      state.personalGoals = state.personalGoals.filter(g => g._id !== goalId)
      state.hierarchyGoals = state.hierarchyGoals.filter(g => g._id !== goalId)
      state.checklistGoals = state.checklistGoals.filter(g => g._id !== goalId)
      
      if (state.currentGoal?._id === goalId) {
        state.currentGoal = null
      }
    },
    
    goalProgressUpdatedRealtime: (state, action) => {
      const updatedGoal = action.payload?.goal || action.payload
      
      const updateInArray = (array) => {
        const index = array.findIndex(g => g._id === updatedGoal._id)
        if (index !== -1) array[index] = updatedGoal
      }
      
      updateInArray(state.annualGoals)
      updateInArray(state.quarterlyGoals)
      updateInArray(state.monthlyGoals)
      updateInArray(state.weeklyGoals)
      updateInArray(state.dailyGoals)
      updateInArray(state.focusGoals)
      updateInArray(state.personalGoals)
      updateInArray(state.hierarchyGoals)
      updateInArray(state.checklistGoals)
      
      if (state.currentGoal?._id === updatedGoal._id) {
        state.currentGoal = updatedGoal
      }
    },
    
    // 🆕 Ajouter une action pour forcer le rechargement des données weekly
    refreshWeeklyGoals: (state) => {
      console.log('🔄 [goalSlice] refreshWeeklyGoals');
      state.weeklyGoals = [];
    }
  },
  
  /**
   * COMMIT: feat(goals): Add extraReducers for hierarchical views
   * 
   * Ajoute les reducers pour gérer les réponses des nouvelles vues
   */
  extraReducers: (builder) => {
    builder
      // ==================== VUE ANNUEL ====================
      .addCase(getAnnualGoals.pending, (state) => {
        console.log('⏳ [goalSlice] getAnnualGoals.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnnualGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getAnnualGoals.fulfilled', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        state.annualGoals = data.goals || [];
        state.viewMetadata.annual = {
          count: data.count || 0,
          goalsByCategory: data.goalsByCategory || {}
        };
      })
      .addCase(getAnnualGoals.rejected, (state, action) => {
        console.error('❌ [goalSlice] getAnnualGoals.rejected', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== VUE TRIMESTRIEL ====================
      .addCase(getQuarterlyGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getQuarterlyGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getQuarterlyGoals.fulfilled', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        state.quarterlyGoals = data.goals || [];
        state.viewMetadata.quarterly = {
          quarter: data.quarter || 1,
          year: data.year,
          breakdown: data.breakdown || 0,
          personal: data.personal || 0,
          goalsByCategory: data.goalsByCategory || {}
        };
      })
      .addCase(getQuarterlyGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== VUE MENSUEL ====================
      .addCase(getMonthlyGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMonthlyGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getMonthlyGoals.fulfilled', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        state.monthlyGoals = data.goals || [];
        state.viewMetadata.monthly = {
          month: data.month || 1,
          year: data.year,
          monthName: data.monthName || '',
          tasksCount: data.tasksCount || 0,
          breakdown: data.breakdown || 0,
          personal: data.personal || 0,
          goalsByCategory: data.goalsByCategory || {},
          tasks: data.tasks || []
        };
      })
      .addCase(getMonthlyGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== 🆕 VUE HEBDOMADAIRE - AGRÉGÉE ====================
      .addCase(getWeeklyGoals.pending, (state) => {
        console.log('⏳ [goalSlice] getWeeklyGoals.pending - AGGREGATED');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWeeklyGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getWeeklyGoals.fulfilled - AGGREGATED', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        
        // 🆕 FORMATION DES DONNÉES AGRÉGÉES
        state.weeklyGoals = formatAggregatedWeeklyGoals(data);
        
        // 🆕 METADONNÉES MISES À JOUR
        state.viewMetadata.weekly = {
          week: data.week || 1,
          year: data.year,
          weekStart: data.weekStart,
          weekEnd: data.weekEnd,
          personalGoals: data.personalGoals || [],
          breakdown: data.breakdown || 0,
          personal: data.personal || 0
        };
        
        // 🆕 DEBUG: Vérifier ce qui a été stocké
        console.log(`📊 Stored ${state.weeklyGoals.length} aggregated weekly goals:`);
        state.weeklyGoals.forEach((goal, index) => {
          console.log(`  ${index + 1}. ${goal.title} - ${goal.currentWeekValue}/${goal.weekTarget} ${goal.unit}`);
          if (goal.dailyData && goal.dailyData.length > 0) {
            console.log(`     Daily: ${goal.dailyData.map(d => `${d.day}:${d.value !== null ? d.value : '-'}`).join(', ')}`);
          }
        });
      })
      .addCase(getWeeklyGoals.rejected, (state, action) => {
        console.error('❌ [goalSlice] getWeeklyGoals.rejected - AGGREGATED', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== VUE QUOTIDIEN + FOCUS ====================
      .addCase(getDailyGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDailyGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getDailyGoals.fulfilled', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        state.dailyGoals = data.goals || [];
        state.focusGoals = data.focus?.goals || [];
        state.viewMetadata.daily = {
          date: data.date,
          dateFormatted: data.dateFormatted || '',
          focusProgress: data.focus?.progress || 0,
          focusCompleted: data.focus?.completed || 0,
          focusTotal: data.focus?.total || 0,
          breakdown: data.breakdown || 0,
          personal: data.personal || 0,
          tasksCount: data.tasksCount || 0,
          tasks: data.tasks || []
        };
      })
      .addCase(getDailyGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== OBJECTIFS PERSONNELS ====================
      .addCase(getPersonalGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPersonalGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getPersonalGoals.fulfilled', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const data = action.payload.data || action.payload;
        state.personalGoals = data.goals || [];
      })
      .addCase(getPersonalGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== ANCIENNES VUES (COMPATIBILITÉ) ====================
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] getGoals.fulfilled (ancienne méthode)', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        
        const rawGoals = action.payload.data?.goals || action.payload.data?.data || action.payload.data || action.payload || [];
        const goals = Array.isArray(rawGoals) ? rawGoals : [];
        
        if (action.meta.arg?.display_in_hierarchy) {
          state.hierarchyGoals = goals;
        }
        if (action.meta.arg?.display_in_checklist) {
          state.checklistGoals = goals;
        }
        if (!action.meta.arg?.display_in_hierarchy && !action.meta.arg?.display_in_checklist) {
          state.hierarchyGoals = goals.filter(g => g.display_in_hierarchy);
          state.checklistGoals = goals.filter(g => g.display_in_checklist);
        }
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== GET SINGLE GOAL ====================
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
      
      // ==================== CREATE GOAL ====================
      .addCase(createGoal.pending, (state) => {
        console.log('⏳ [goalSlice] createGoal.pending');
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        console.log('✅ [goalSlice] createGoal.fulfilled', action.payload);
        state.isCreating = false;
        state.isSuccess = true;
        state.successMessage = action.payload.message || 'Objectif créé avec succès';
        
        const newGoal = action.payload.data?.goal || action.payload.data;
        
        // Ajouter dans la vue appropriée
        if (newGoal) {
          if (newGoal.level === 'annual') state.annualGoals.unshift(newGoal)
          if (newGoal.level === 'quarterly') state.quarterlyGoals.unshift(newGoal)
          if (newGoal.level === 'monthly') state.monthlyGoals.unshift(newGoal)
          if (newGoal.level === 'weekly') state.weeklyGoals.unshift(newGoal)
          if (newGoal.level === 'daily') state.dailyGoals.unshift(newGoal)
          if (newGoal.is_personal) state.personalGoals.unshift(newGoal)
          
          if (newGoal.display_in_hierarchy) state.hierarchyGoals.unshift(newGoal)
          if (newGoal.display_in_checklist) state.checklistGoals.unshift(newGoal)
        }
      })
      .addCase(createGoal.rejected, (state, action) => {
        console.error('❌ [goalSlice] createGoal.rejected', action.payload);
        state.isCreating = false;
        state.isError = true;
        state.error = action.payload;
      })
      
      // ==================== UPDATE GOAL ====================
      .addCase(updateGoal.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isUpdating = false
        state.isSuccess = true
        state.successMessage = 'Objectif mis à jour'
        
        const updated = action.payload.data?.goal || action.payload.data
        
        const updateInArray = (array) => {
          const index = array.findIndex(g => g._id === updated._id)
          if (index !== -1) array[index] = updated
        }
        
        updateInArray(state.annualGoals)
        updateInArray(state.quarterlyGoals)
        updateInArray(state.monthlyGoals)
        updateInArray(state.weeklyGoals)
        updateInArray(state.dailyGoals)
        updateInArray(state.focusGoals)
        updateInArray(state.personalGoals)
        updateInArray(state.hierarchyGoals)
        updateInArray(state.checklistGoals)
        
        if (state.currentGoal?._id === updated._id) {
          state.currentGoal = updated
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isUpdating = false
        state.isError = true
        state.error = action.payload
      })
      
      // ==================== DELETE GOAL ====================
      .addCase(deleteGoal.pending, (state) => {
        state.isDeleting = true
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isDeleting = false
        state.isSuccess = true
        state.successMessage = 'Objectif supprimé'
        
        const deletedId = action.payload
        
        state.annualGoals = state.annualGoals.filter(g => g._id !== deletedId)
        state.quarterlyGoals = state.quarterlyGoals.filter(g => g._id !== deletedId)
        state.monthlyGoals = state.monthlyGoals.filter(g => g._id !== deletedId)
        state.weeklyGoals = state.weeklyGoals.filter(g => g._id !== deletedId)
        state.dailyGoals = state.dailyGoals.filter(g => g._id !== deletedId)
        state.focusGoals = state.focusGoals.filter(g => g._id !== deletedId)
        state.personalGoals = state.personalGoals.filter(g => g._id !== deletedId)
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
      
      // ==================== UPDATE PROGRESS ====================
      .addCase(updateProgress.fulfilled, (state, action) => {
        const updated = action.payload.data?.goal || action.payload.data
        
        const updateInArray = (array) => {
          const index = array.findIndex(g => g._id === updated._id)
          if (index !== -1) array[index] = updated
        }
        
        updateInArray(state.annualGoals)
        updateInArray(state.quarterlyGoals)
        updateInArray(state.monthlyGoals)
        updateInArray(state.weeklyGoals)
        updateInArray(state.dailyGoals)
        updateInArray(state.focusGoals)
        updateInArray(state.hierarchyGoals)
        updateInArray(state.checklistGoals)
      })
      
      // ==================== COMPLETE STEP ====================
      .addCase(completeStep.fulfilled, (state, action) => {
        const updated = action.payload.data?.goal || action.payload.data
        
        const updateInArray = (array) => {
          const index = array.findIndex(g => g._id === updated._id)
          if (index !== -1) array[index] = updated
        }
        
        updateInArray(state.personalGoals)
        updateInArray(state.checklistGoals)
        updateInArray(state.focusGoals)
      })
      
      // ==================== GET STATS ====================
      .addCase(getGoalsStats.fulfilled, (state, action) => {
        state.stats = action.payload.data || action.payload
      })
  }
})

export const {
  reset,
  setHierarchyLevel,
  setHierarchyCategory,
  setHierarchyYear,
  setHierarchyQuarter,
  setHierarchyMonth,
  setHierarchyWeek,
  setHierarchyDate,
  clearCurrentGoal,
  clearMessages,
  goalCreatedRealtime,
  goalUpdatedRealtime,
  goalDeletedRealtime,
  goalProgressUpdatedRealtime,
  refreshWeeklyGoals // 🆕 Exporté
} = goalSlice.actions

export default goalSlice.reducer