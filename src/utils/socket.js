// frontend/src/utils/socket.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Initialiser la connexion Socket.IO
  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log('✅ Socket already connected');
      return this.socket;
    }

    // Utiliser la même base URL que l'API
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Events de connexion
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      
      // Rejoindre la room de l'utilisateur
      if (userId) {
        this.socket.emit('join-user-room', userId);
        console.log(`👤 Joined user room: ${userId}`);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
      if (userId) {
        this.socket.emit('join-user-room', userId);
      }
    });

    return this.socket;
  }

  // Déconnecter
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected manually');
    }
  }

  // Écouter un event
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }
    this.socket.on(event, callback);
  }

  // Retirer un listener
  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  // Émettre un event
  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }
    this.socket.emit(event, data);
  }

  // Obtenir le socket
  getSocket() {
    return this.socket;
  }

  // Vérifier si connecté
  getIsConnected() {
    return this.isConnected;
  }
}

// Export singleton
export default new SocketService();