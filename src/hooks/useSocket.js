// frontend/src/hooks/useSocket.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from '../utils/socket';
import { updateTaskInStore, removeTaskFromStore } from '../redux/slices/taskSlice';

/**
 * Hook pour gérer Socket.IO dans les composants
 * - Initialise connexion au mount
 * - Écoute les events task-updated, task-created, etc.
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

    // Écouter les events

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

    // Attacher les listeners
    socketService.on('task-created', handleTaskCreated);
    socketService.on('task-updated', handleTaskUpdated);
    socketService.on('task-status-updated', handleTaskStatusUpdated);
    socketService.on('task-deleted', handleTaskDeleted);

    // Cleanup au unmount
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socketService.off('task-created', handleTaskCreated);
      socketService.off('task-updated', handleTaskUpdated);
      socketService.off('task-status-updated', handleTaskStatusUpdated);
      socketService.off('task-deleted', handleTaskDeleted);
    };
  }, [user, dispatch]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.getIsConnected()
  };
};