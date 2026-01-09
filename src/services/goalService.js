import axios from 'axios';

const API_URL = '/api/goals';

// Helper pour gérer les erreurs
const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Une erreur est survenue';
  throw new Error(message);
};

// ==================== CRUD DE BASE ====================

/**
 * Créer un nouvel objectif
 */
export const createGoal = async (goalData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(API_URL, goalData, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtenir tous les objectifs avec filtres
 */
export const getGoals = async (filters, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: filters
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtenir un objectif par ID
 */
export const getGoalById = async (goalId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(`${API_URL}/${goalId}`, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Mettre à jour un objectif
 */
export const updateGoal = async (goalId, goalData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(`${API_URL}/${goalId}`, goalData, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Supprimer un objectif
 */
export const deleteGoal = async (goalId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.delete(`${API_URL}/${goalId}`, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== PROGRESSION ====================

/**
 * Mettre à jour la progression d'un objectif
 */
export const updateProgress = async (goalId, progressData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(
      `${API_URL}/${goalId}/progress`,
      progressData,
      config
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Compléter/décompléter une étape
 */
export const completeStep = async (goalId, stepId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(
      `${API_URL}/${goalId}/steps/${stepId}/complete`,
      {},
      config
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Recalculer un objectif depuis ses enfants
 */
export const recalculateFromChildren = async (goalId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(
      `${API_URL}/${goalId}/recalculate`,
      {},
      config
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== INTÉGRATIONS ====================

/**
 * Synchroniser l'objectif commits
 */
export const syncCommitsGoal = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(`${API_URL}/sync-commits`, {}, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Synchroniser l'objectif livres pour un projet
 */
export const syncBookGoal = async (projectId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(
      `${API_URL}/sync-book/${projectId}`,
      {},
      config
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== STATS ====================

/**
 * Obtenir les statistiques des objectifs
 */
export const getGoalsStats = async (filters, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: filters
    };

    const response = await axios.get(`${API_URL}/stats/summary`, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const goalService = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateProgress,
  completeStep,
  recalculateFromChildren,
  syncCommitsGoal,
  syncBookGoal,
  getGoalsStats
};

export default goalService;