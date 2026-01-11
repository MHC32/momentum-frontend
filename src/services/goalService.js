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
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/annual?${params}`);
  return response.data;
}

// Get quarterly goals
const getQuarterlyGoals = async (quarter, filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/quarterly/${quarter}?${params}`);
  return response.data;
}

// Get monthly goals
const getMonthlyGoals = async (month, filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/monthly/${month}?${params}`);
  return response.data;
}

// Get weekly goals
const getWeeklyGoals = async (week, filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/weekly/${week}?${params}`);
  return response.data;
}

// Get daily goals + Focus du jour
const getDailyGoals = async (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/daily?${params}`);
  return response.data;
}

// ==================== OBJECTIFS PERSONNELS (NOUVEAU V2) ====================

/**
 * COMMIT: feat(goals): Add personal goals service method
 * 
 * Ajoute la méthode pour récupérer les objectifs personnels
 * avec filtrage par status (ongoing/completed) et catégorie
 */
const getPersonalGoals = async (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/personal?${params}`);
  return response.data;
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
  const response = await api.post('/goals', goalData);
  return response.data;
}

// Get all goals (ANCIENNE MÉTHODE - gardée pour compatibilité)
const getGoals = async (filters = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals?${params}`);
  return response.data;
}

// Get single goal
const getGoalById = async (goalId) => {
  const response = await api.get(`/goals/${goalId}`);
  return response.data;
}

// Update goal
const updateGoal = async (goalId, goalData) => {
  const response = await api.put(`/goals/${goalId}`, goalData);
  return response.data;
}

// Delete goal
const deleteGoal = async (goalId) => {
  const response = await api.delete(`/goals/${goalId}`);
  return response.data;
}

// ==================== PROGRESSION ====================

// Update progress
const updateProgress = async (goalId, progressData) => {
  const response = await api.put(`/goals/${goalId}/progress`, progressData);
  return response.data;
}

// Complete/uncomplete step
const completeStep = async (goalId, stepId) => {
  const response = await api.put(`/goals/${goalId}/steps/${stepId}/complete`, {});
  return response.data;
}

// Recalculate from children (DEPRECATED - géré automatiquement par le backend V2)
const recalculateFromChildren = async (goalId) => {
  // NOTE: Cette fonction est deprecated dans V2
  // La propagation est automatique via propagateProgressUp()
  console.warn('[goalService] recalculateFromChildren is deprecated in V2');
  const response = await api.post(`/goals/${goalId}/recalculate`, {});
  return response.data;
}

// ==================== INTEGRATIONS ====================

// Sync commits goal (DEPRECATED - remplacé par webhooks)
const syncCommitsGoal = async () => {
  // NOTE: Dans V2, le sync se fait automatiquement via webhooks GitHub
  console.warn('[goalService] syncCommitsGoal is deprecated - using webhooks in V2');
  const response = await api.post('/goals/sync-commits', {});
  return response.data;
}

// Sync book goal (DEPRECATED - remplacé par webhooks)
const syncBookGoal = async (projectId) => {
  // NOTE: Dans V2, le sync se fait automatiquement via webhooks
  console.warn('[goalService] syncBookGoal is deprecated - using webhooks in V2');
  const response = await api.post(`/goals/sync-book/${projectId}`, {});
  return response.data;
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
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(cleanFilters);
  const response = await api.get(`/goals/stats?${params}`);
  return response.data;
}

// ==================== RISE WEBHOOKS (NOUVEAU V2) ====================

/**
 * COMMIT: feat(goals): Add Rise integration service methods
 * 
 * Ajoute les méthodes pour interagir avec l'intégration Rise:
 * - Obtenir les objectifs avec Rise integration activée
 */
const getRiseIntegratedGoals = async () => {
  const response = await api.get('/webhooks/rise/goals');
  return response.data;
}

// ==================== EXPORT ====================

const goalService = {
  // Nouvelles méthodes V2 (vues hiérarchiques)
  getAnnualGoals,
  getQuarterlyGoals,
  getMonthlyGoals,
  getWeeklyGoals,
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