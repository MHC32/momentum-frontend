import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getGoals, 
  completeStep,
  updateProgress,
  clearMessages
} from '../redux/slices/goalSlice'
import { useSocket } from '../hooks/useSocket'
import Sidebar from '../components/Sidebar'
import GoalChecklistCard from '../components/goals/GoalChecklistCard'

function GoalsChecklist() {
  const dispatch = useDispatch()
  const { isConnected } = useSocket()
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  
  const { 
    checklistGoals, 
    isLoading,
    error,
    successMessage
  } = useSelector((state) => state.goals)

  // Charger les objectifs au montage
  useEffect(() => {
    dispatch(getGoals({
      display_in_checklist: true
    }))
  }, [dispatch])

  // Clear messages après 3 secondes
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  // Filtrer les goals par statut
  const safeChecklistGoals = Array.isArray(checklistGoals) ? checklistGoals : []
  const filteredGoals = safeChecklistGoals.filter((goal) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'completed') return goal.completed || goal.progress_percent >= 100
    if (filterStatus === 'pending') return !goal.completed && goal.progress_percent < 100
    return true
  })

  // Handler pour toggle une étape
  const handleStepToggle = (goalId, stepId) => {
    dispatch(completeStep({ goalId, stepId }))
  }

  // Handler pour mettre à jour la progression
  const handleProgressUpdate = (goalId, increment) => {
    dispatch(updateProgress({
      goalId,
      progressData: { increment }
    }))
  }

  // Handler pour marquer comme terminé (objectifs simple)
  const handleMarkComplete = (goalId) => {
    dispatch(updateProgress({
      goalId,
      progressData: { value: 1 }
    }))
  }

  // Statistiques
  const stats = {
    total: safeChecklistGoals.length,
    completed: safeChecklistGoals.filter(g => g.completed || g.progress_percent >= 100).length,
    pending: safeChecklistGoals.filter(g => !g.completed && g.progress_percent < 100).length
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Objectifs Personnels
            </h1>
            <p className="text-gray-400">
              Gérez vos objectifs personnels avec checklists et étapes
            </p>
            
            {/* Socket.IO status indicator (dev only) */}
            {import.meta.env.DEV && (
              <div className="text-xs mt-2">
                {isConnected ? (
                  <span className="text-green-400">🟢 Socket connecté</span>
                ) : (
                  <span className="text-red-400">🔴 Socket déconnecté</span>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Nouvel objectif
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
            {successMessage}
          </div>
        )}

        {/* Stats & Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Stats */}
          <div className="flex gap-4">
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-momentum-light-2">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-xs text-gray-500">Terminés</div>
            </div>
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
              <div className="text-xs text-gray-500">En cours</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'pending', label: 'En cours' },
              { value: 'completed', label: 'Terminés' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  filterStatus === f.value
                    ? f.value === 'completed' ? 'bg-green-500 text-white'
                    : f.value === 'pending' ? 'bg-orange-500 text-white'
                    : 'bg-momentum-light-2 text-momentum-dark'
                    : 'bg-momentum-dark/30 text-gray-300 hover:bg-momentum-dark/50 border border-momentum-light-1/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-momentum-light-2"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredGoals.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-momentum-dark/40 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filterStatus === 'all' 
                ? 'Aucun objectif personnel'
                : filterStatus === 'completed'
                ? 'Aucun objectif terminé'
                : 'Aucun objectif en cours'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              Créez votre premier objectif personnel avec checklist
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Créer un objectif
            </button>
          </div>
        )}

        {/* Goals List */}
        {!isLoading && filteredGoals.length > 0 && (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <GoalChecklistCard
                key={goal._id}
                goal={goal}
                onStepToggle={handleStepToggle}
                onProgressUpdate={handleProgressUpdate}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nouvel Objectif</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-gray-400 mb-4">
                Le formulaire de création d'objectif sera implémenté prochainement.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalsChecklist