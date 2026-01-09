// frontend/src/hooks/useSocket.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../utils/socket';
import { updateTaskInStore, removeTaskFromStore } from '../redux/slices/taskSlice';
import {
  goalCreatedRealtime,
  goalUpdatedRealtime,
  goalDeletedRealtime,
  goalProgressUpdatedRealtime
} from '../redux/slices/goalSlice';

/**
 * Hook pour gérer Socket.IO dans les composants
 * - Initialise connexion au mount
 * - Écoute les events task-updated, task-created, goal-updated, etc.
 * - Nettoie au unmount
 */
export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Connexion Socket.IO
    // eslint-disable-next-line no-unused-vars
    const socket = socketService.connect(user.id);
    console.log('🔌 Socket initialized in useSocket hook');

    // ==================== TASKS EVENTS ====================

    // 1. Task créée
    const handleTaskCreated = (data) => {
      console.log('📥 task-created event:', data);
      dispatch(updateTaskInStore(data.task));
    };

    // 2. Task mise à jour (title, description, etc.)
    const handleTaskUpdated = (data) => {
      console.log('📥 task-updated event:', data);
      // Si c'est un commit ajouté
      if (data.type === 'commit-added' && data.commit) {
        console.log(`💾 New commit: ${data.commit.message} by ${data.commit.author}`);
      }
      dispatch(updateTaskInStore(data.task));
    };

    // 3. Task status changé (drag Kanban ou checkbox Dashboard)
    const handleTaskStatusUpdated = (data) => {
      console.log('📥 task-status-updated event:', data);
      dispatch(updateTaskInStore(data.task));
    };

    // 4. Task supprimée
    const handleTaskDeleted = (data) => {
      console.log('📥 task-deleted event:', data);
      dispatch(removeTaskFromStore(data.taskId));
    };

    // ==================== GOALS EVENTS ====================

    // 1. Goal créé
    const handleGoalCreated = (data) => {
      console.log('🎯 goal-created event:', data);
      dispatch(goalCreatedRealtime(data));
    };

    // 2. Goal mis à jour
    const handleGoalUpdated = (data) => {
      console.log('🎯 goal-updated event:', data);
      dispatch(goalUpdatedRealtime(data));
    };

    // 3. Goal supprimé
    const handleGoalDeleted = (data) => {
      console.log('🎯 goal-deleted event:', data);
      dispatch(goalDeletedRealtime(data));
    };

    // 4. Progression mise à jour
    const handleGoalProgressUpdated = (data) => {
      console.log('🎯 goal-progress-updated event:', data);
      dispatch(goalProgressUpdatedRealtime(data));
    };

    // 5. Commits synchronisés (auto-update)
    const handleGoalCommitsSynced = (data) => {
      console.log('💻 goal-commits-synced event:', data);
      console.log(`✅ Total commits: ${data.totalCommits} (+${data.amountChanged})`);
      dispatch(goalProgressUpdatedRealtime(data));
    };

    // 6. Livre complété (auto-update)
    const handleBookCompleted = (data) => {
      console.log('📚 book-completed event:', data);
      console.log(`✅ Livre complété: ${data.bookTitle}`);
      dispatch(goalProgressUpdatedRealtime(data));
      
      // Optionnel : Afficher une notification toast
      // if (window.toast) {
      //   window.toast.success(`📚 Livre complété: ${data.bookTitle}`);
      // }
    };

    // 7. Étape complétée
    const handleGoalStepCompleted = (data) => {
      console.log('✅ goal-step-completed event:', data);
      dispatch(goalUpdatedRealtime(data));
    };

    // 8. Goal recalculé
    const handleGoalRecalculated = (data) => {
      console.log('🔄 goal-recalculated event:', data);
      dispatch(goalUpdatedRealtime(data));
    };

    // ==================== ATTACHER LES LISTENERS ====================

    // Tasks
    socketService.on('task-created', handleTaskCreated);
    socketService.on('task-updated', handleTaskUpdated);
    socketService.on('task-status-updated', handleTaskStatusUpdated);
    socketService.on('task-deleted', handleTaskDeleted);

    // Goals
    socketService.on('goal-created', handleGoalCreated);
    socketService.on('goal-updated', handleGoalUpdated);
    socketService.on('goal-deleted', handleGoalDeleted);
    socketService.on('goal-progress-updated', handleGoalProgressUpdated);
    socketService.on('goal-commits-synced', handleGoalCommitsSynced);
    socketService.on('book-completed', handleBookCompleted);
    socketService.on('goal-step-completed', handleGoalStepCompleted);
    socketService.on('goal-recalculated', handleGoalRecalculated);

    // ==================== CLEANUP AU UNMOUNT ====================

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      
      // Tasks
      socketService.off('task-created', handleTaskCreated);
      socketService.off('task-updated', handleTaskUpdated);
      socketService.off('task-status-updated', handleTaskStatusUpdated);
      socketService.off('task-deleted', handleTaskDeleted);

      // Goals
      socketService.off('goal-created', handleGoalCreated);
      socketService.off('goal-updated', handleGoalUpdated);
      socketService.off('goal-deleted', handleGoalDeleted);
      socketService.off('goal-progress-updated', handleGoalProgressUpdated);
      socketService.off('goal-commits-synced', handleGoalCommitsSynced);
      socketService.off('book-completed', handleBookCompleted);
      socketService.off('goal-step-completed', handleGoalStepCompleted);
      socketService.off('goal-recalculated', handleGoalRecalculated);
    };
  }, [user, dispatch]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.getIsConnected()
  };
};