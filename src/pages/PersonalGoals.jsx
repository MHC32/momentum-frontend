/**
 * COMMIT: feat(goals): Create PersonalGoals page for flexible duration goals
 * 
 * Crée la page Objectifs Personnels pour gérer les objectifs à durée flexible
 * avec filtrage par status (ongoing/completed)
 */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getPersonalGoals,
  completeStep,
  updateProgress,
  clearMessages
} from '../redux/slices/goalSlice'
import { useSocket } from '../hooks/useSocket'
import Sidebar from '../components/Sidebar'
import GoalChecklistCard from '../components/goals/GoalChecklistCard'
import GoalModal from '../components/GoalModal'

function PersonalGoals() {
  const dispatch = useDispatch()
  const { isConnected } = useSocket()
  const [filterStatus, setFilterStatus] = useState('ongoing')
  const [filterCategory, setFilterCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const { 
    personalGoals, 
    isLoading,
    error,
    successMessage
  } = useSelector((state) => state.goals)

  // Charger les objectifs personnels
  useEffect(() => {
    dispatch(getPersonalGoals({
      status: filterStatus === 'all' ? undefined : filterStatus,
      category: filterCategory
    }))
  }, [dispatch, filterStatus, filterCategory])

  // Clear messages après 3 secondes
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  // Filtrer les goals
  const safePersonalGoals = Array.isArray(personalGoals) ? personalGoals : []
  
  // Séparer ongoing et completed
  const ongoingGoals = safePersonalGoals.filter(g => !g.completed && g.progress_percent < 100)
  const completedGoals = safePersonalGoals.filter(g => g.completed || g.progress_percent >= 100)

  const displayGoals = filterStatus === 'all' 
    ? safePersonalGoals 
    : filterStatus === 'ongoing' 
    ? ongoingGoals 
    : completedGoals

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

  // Handler pour marquer comme terminé
  const handleMarkComplete = (goalId) => {
    dispatch(updateProgress({
      goalId,
      progressData: { value: 1 }
    }))
  }

  // Statistiques
  const stats = {
    total: safePersonalGoals.length,
    ongoing: ongoingGoals.length,
    completed: completedGoals.length
  }

  // Catégories
  const categories = [
    { value: null, label: 'Toutes', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { value: 'financial', label: 'Financier', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { value: 'professional', label: 'Professionnel', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { value: 'learning', label: 'Apprentissage', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { value: 'personal', label: 'Personnel', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { value: 'health', label: 'Santé', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ]

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
              Suis tes objectifs et leur progression
            </p>
            
            {/* Socket.IO status (dev only) */}
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
            Nouvel objectif
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

        {/* Stats & Filters Row */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Stats */}
          <div className="flex gap-4">
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-momentum-light-2">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-orange-400">{stats.ongoing}</div>
              <div className="text-xs text-gray-500">En cours</div>
            </div>
            <div className="glass-card px-4 py-3">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-xs text-gray-500">Terminés</div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-3">
            {[
              { value: 'all', label: 'Tous', color: 'bg-momentum-light-2' },
              { value: 'ongoing', label: 'En cours', color: 'bg-orange-500' },
              { value: 'completed', label: 'Terminés', color: 'bg-green-500' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  filterStatus === f.value
                    ? `${f.color} text-white`
                    : 'bg-momentum-dark/30 text-gray-300 hover:bg-momentum-dark/50 border border-momentum-light-1/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setFilterCategory(cat.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all font-medium
                ${filterCategory === cat.value
                  ? 'bg-gradient-to-r from-momentum-light-2 to-momentum-accent text-white shadow-lg'
                  : 'bg-momentum-dark/30 text-gray-300 hover:bg-momentum-dark/50 border border-momentum-light-1/20'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} />
              </svg>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-momentum-light-2"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayGoals.length === 0 && (
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
              Créez votre premier objectif personnel avec durée flexible
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Créer un objectif
            </button>
          </div>
        )}

        {/* Goals List */}
        {!isLoading && displayGoals.length > 0 && (
          <div className="space-y-4">
            {displayGoals.map((goal) => (
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

      {/* Goal Modal */}
      {showModal && (
        <GoalModal 
          onClose={() => setShowModal(false)}
          defaultView="checklist"
        />
      )}
    </div>
  )
}

export default PersonalGoals