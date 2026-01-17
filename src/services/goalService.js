/* eslint-disable no-unused-vars */
import api from '../utils/axios'

// ==================== VUES HIÉRARCHIQUES (NOUVEAU V2) ====================

/**
 * COMMIT: feat(goals): Add hierarchical views service methods
 * 
 * Ajoute les méthodes pour récupérer les objectifs selon différentes vues:
 * - Vue Annuel
 * - Vue Trimestriel (Q1-Q4)
 * - Vue Mensuel (Jan-Déc)
 * - Vue Hebdomadaire (W1-W52)
 * - Vue Quotidien + Focus du jour
 */

// Get annual goals
const getAnnualGoals = async (filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/annual?${params}`);
    console.log('📡 [goalService] getAnnualGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getAnnualGoals - Error:', error);
    throw error;
  }
}

// Get quarterly goals
const getQuarterlyGoals = async (quarter, filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/quarterly/${quarter}?${params}`);
    console.log('📡 [goalService] getQuarterlyGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getQuarterlyGoals - Error:', error);
    throw error;
  }
}

// Get monthly goals
const getMonthlyGoals = async (month, filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/monthly/${month}?${params}`);
    console.log('📡 [goalService] getMonthlyGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getMonthlyGoals - Error:', error);
    throw error;
  }
}

// 🆕 MODIFIÉ: Get weekly goals - RETOURNE DES DONNÉES AGRÉGÉES
const getWeeklyGoals = async (week, filters = {}) => {
  try {
    console.log(`📡 [goalService] getWeeklyGoals - Week ${week}, filters:`, filters);
    
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/weekly/${week}?${params}`);
    
    console.log('✅ [goalService] getWeeklyGoals - Response structure:', {
      hasGoals: !!response.data?.goals,
      goalsCount: response.data?.goals?.length || 0,
      isAggregated: response.data?.goals?.[0]?.dailyData !== undefined
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getWeeklyGoals - Error:', error);
    throw error;
  }
}

// Get daily goals + Focus du jour
const getDailyGoals = async (filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/daily?${params}`);
    console.log('📡 [goalService] getDailyGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getDailyGoals - Error:', error);
    throw error;
  }
}

// ==================== OBJECTIFS PERSONNELS (NOUVEAU V2) ====================

/**
 * COMMIT: feat(goals): Add personal goals service method
 * 
 * Ajoute la méthode pour récupérer les objectifs personnels
 * avec filtrage par status (ongoing/completed) et catégorie
 */
const getPersonalGoals = async (filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/personal?${params}`);
    console.log('📡 [goalService] getPersonalGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getPersonalGoals - Error:', error);
    throw error;
  }
}

// ==================== CRUD DE BASE ====================

/**
 * COMMIT: fix(goals): Fix syntax errors in API calls
 * 
 * Corrige les erreurs de syntaxe (backticks au lieu de parenthèses)
 * dans tous les appels API
 */

// Create goal
const createGoal = async (goalData) => {
  try {
    console.log('📡 [goalService] createGoal - Data:', goalData);
    const response = await api.post('/goals', goalData);
    console.log('✅ [goalService] createGoal - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] createGoal - Error:', error);
    throw error;
  }
}

// Get all goals (ANCIENNE MÉTHODE - gardée pour compatibilité)
const getGoals = async (filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals?${params}`);
    console.log('📡 [goalService] getGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getGoals - Error:', error);
    throw error;
  }
}

// Get single goal
const getGoalById = async (goalId) => {
  try {
    console.log('📡 [goalService] getGoalById - ID:', goalId);
    const response = await api.get(`/goals/${goalId}`);
    console.log('✅ [goalService] getGoalById - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getGoalById - Error:', error);
    throw error;
  }
}

// Update goal
const updateGoal = async (goalId, goalData) => {
  try {
    console.log('📡 [goalService] updateGoal - ID:', goalId, 'Data:', goalData);
    const response = await api.put(`/goals/${goalId}`, goalData);
    console.log('✅ [goalService] updateGoal - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] updateGoal - Error:', error);
    throw error;
  }
}

// Delete goal
const deleteGoal = async (goalId) => {
  try {
    console.log('📡 [goalService] deleteGoal - ID:', goalId);
    const response = await api.delete(`/goals/${goalId}`);
    console.log('✅ [goalService] deleteGoal - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] deleteGoal - Error:', error);
    throw error;
  }
}

// ==================== PROGRESSION ====================

// Update progress
const updateProgress = async (goalId, progressData) => {
  try {
    console.log('📡 [goalService] updateProgress - ID:', goalId, 'Data:', progressData);
    const response = await api.put(`/goals/${goalId}/progress`, progressData);
    console.log('✅ [goalService] updateProgress - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] updateProgress - Error:', error);
    throw error;
  }
}

// Complete/uncomplete step
const completeStep = async (goalId, stepId) => {
  try {
    console.log('📡 [goalService] completeStep - GoalID:', goalId, 'StepID:', stepId);
    const response = await api.put(`/goals/${goalId}/steps/${stepId}/complete`, {});
    console.log('✅ [goalService] completeStep - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] completeStep - Error:', error);
    throw error;
  }
}

// Recalculate from children (DEPRECATED - géré automatiquement par le backend V2)
const recalculateFromChildren = async (goalId) => {
  // NOTE: Cette fonction est deprecated dans V2
  // La propagation est automatique via propagateProgressUp()
  console.warn('[goalService] recalculateFromChildren is deprecated in V2');
  try {
    const response = await api.post(`/goals/${goalId}/recalculate`, {});
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] recalculateFromChildren - Error:', error);
    throw error;
  }
}

// ==================== INTEGRATIONS ====================

// Sync commits goal (DEPRECATED - remplacé par webhooks)
const syncCommitsGoal = async () => {
  // NOTE: Dans V2, le sync se fait automatiquement via webhooks GitHub
  console.warn('[goalService] syncCommitsGoal is deprecated - using webhooks in V2');
  try {
    const response = await api.post('/goals/sync-commits', {});
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] syncCommitsGoal - Error:', error);
    throw error;
  }
}

// Sync book goal (DEPRECATED - remplacé par webhooks)
const syncBookGoal = async (projectId) => {
  // NOTE: Dans V2, le sync se fait automatiquement via webhooks
  console.warn('[goalService] syncBookGoal is deprecated - using webhooks in V2');
  try {
    const response = await api.post(`/goals/sync-book/${projectId}`, {});
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] syncBookGoal - Error:', error);
    throw error;
  }
}

// ==================== STATS ====================

/**
 * COMMIT: fix(goals): Update stats endpoint URL
 * 
 * Met à jour l'URL de l'endpoint stats pour correspondre au backend V2
 * Ancien: /goals/stats/summary
 * Nouveau: /goals/stats
 */
const getGoalsStats = async (filters = {}) => {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters);
    const response = await api.get(`/goals/stats?${params}`);
    console.log('📡 [goalService] getGoalsStats - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getGoalsStats - Error:', error);
    throw error;
  }
}

// ==================== RISE WEBHOOKS (NOUVEAU V2) ====================

/**
 * COMMIT: feat(goals): Add Rise integration service methods
 * 
 * Ajoute les méthodes pour interagir avec l'intégration Rise:
 * - Obtenir les objectifs avec Rise integration activée
 */
const getRiseIntegratedGoals = async () => {
  try {
    const response = await api.get('/webhooks/rise/goals');
    console.log('📡 [goalService] getRiseIntegratedGoals - Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [goalService] getRiseIntegratedGoals - Error:', error);
    throw error;
  }
}

// ==================== EXPORT ====================

const goalService = {
  // Nouvelles méthodes V2 (vues hiérarchiques)
  getAnnualGoals,
  getQuarterlyGoals,
  getMonthlyGoals,
  getWeeklyGoals, // 🆕 Retourne maintenant des données agrégées
  getDailyGoals,
  getPersonalGoals,
  
  // CRUD de base
  createGoal,
  getGoals, // Ancienne méthode - gardée pour compatibilité
  getGoalById,
  updateGoal,
  deleteGoal,
  
  // Progression
  updateProgress,
  completeStep,
  recalculateFromChildren, // DEPRECATED
  
  // Intégrations
  syncCommitsGoal, // DEPRECATED
  syncBookGoal, // DEPRECATED
  
  // Stats
  getGoalsStats,
  
  // Rise
  getRiseIntegratedGoals
}

export default goalService;